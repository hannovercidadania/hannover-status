// VIGIA EXTERNO DA HANNOVER
//
// Roda no GitHub Actions, de propósito: é a única peça do conjunto que NÃO vive na
// Vercel nem na Supabase. Nos dois apagões de 05 e 06.08.2026 a informação existia,
// mas quem devia perceber estava dentro do mesmo prédio que caiu. Um cron da Vercel
// não avisa quando a Vercel engasga, e nada que consulte o Supabase avisa quando o
// Supabase para.
//
// Sem dependências, só o Node da máquina do Actions. Menos coisa para quebrar.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const ALVOS = [
  // O CRM entra pelo endereço de saúde, que executa trabalho de verdade no banco
  // (a consulta da lista de conversas e um cálculo puro) em vez de só responder
  // que está de pé. Ele devolve 502 quando alguma peça está em falha.
  { chave: 'crm', nome: 'CRM', url: 'https://crm.passaportealemao.com.br/api/saude', saude: true, critico: true },
  { chave: 'site_hannover', nome: 'Site Hannover', url: 'https://passaportealemao.com.br/', critico: true },
  { chave: 'site_viena', nome: 'Site Viena', url: 'https://passaporteaustriaco.com.br/', critico: false },
  { chave: 'site_usa', nome: 'Site German Citizenship', url: 'https://germandualcitizenship.com/', critico: false },
  { chave: 'site_werlang', nome: 'Site Werlang', url: 'https://werlang.de/', critico: false },
]

const TETO_MS = 15000
const HISTORICO = 'docs/historico.json'
const MAX_PONTOS = 2016 // 7 dias a cada 5 minutos

async function medir(alvo) {
  const inicio = Date.now()
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), TETO_MS)
  try {
    const r = await fetch(alvo.url, {
      signal: controle.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Vigia-Hannover/1.0 (+github actions)' },
    })
    const ms = Date.now() - inicio
    let componentes = []
    if (alvo.saude) {
      try {
        const corpo = await r.json()
        componentes = Array.isArray(corpo?.componentes) ? corpo.componentes : []
      } catch { /* corpo ilegível: o código HTTP já diz o essencial */ }
    }
    return { chave: alvo.chave, nome: alvo.nome, status: r.status, ms, ok: r.status >= 200 && r.status < 400, componentes }
  } catch (e) {
    // Timeout e erro de rede contam como queda: do lado de fora, a diferença
    // entre "não respondeu" e "respondeu erro" não muda a vida da equipe.
    return {
      chave: alvo.chave, nome: alvo.nome, status: null,
      ms: Date.now() - inicio, ok: false, componentes: [],
      erro: e?.name === 'AbortError' ? `sem resposta em ${TETO_MS / 1000}s` : String(e?.message ?? e),
    }
  } finally {
    clearTimeout(relogio)
  }
}

const agora = new Date().toISOString()
const medicoes = []
for (const alvo of ALVOS) medicoes.push(await medir(alvo))

// Duas tentativas para o que falhou: um blip de rede da máquina do Actions não
// pode virar alarme, senão o aviso perde credibilidade e passa a ser ignorado.
for (let i = 0; i < medicoes.length; i++) {
  if (!medicoes[i].ok) {
    await new Promise(r => setTimeout(r, 4000))
    const segunda = await medir(ALVOS[i])
    if (segunda.ok) segunda.recuperouNaSegunda = true
    medicoes[i] = segunda
  }
}

const historico = existsSync(HISTORICO) ? JSON.parse(readFileSync(HISTORICO, 'utf8')) : []
historico.push({ em: agora, medicoes: medicoes.map(({ componentes, ...resto }) => resto) })
const recorte = historico.slice(-MAX_PONTOS)
writeFileSync(HISTORICO, JSON.stringify(recorte))

// ── Página ──────────────────────────────────────────────────────────────────────
const cor = { ok: '#437057', atencao: '#ffd56c', falha: '#ff293e' }
const estadoDe = m => (m.ok ? 'ok' : 'falha')

function disponibilidade(chave, horas) {
  const corte = Date.now() - horas * 3600 * 1000
  const pontos = recorte.filter(p => new Date(p.em).getTime() >= corte)
    .map(p => p.medicoes.find(m => m.chave === chave)).filter(Boolean)
  if (pontos.length === 0) return null
  return (pontos.filter(m => m.ok).length / pontos.length) * 100
}

function faixa(chave) {
  // Uma barrinha por medição, os últimos 96 pontos (8 h). Verde de pé, vermelho fora.
  return recorte.slice(-96).map(p => {
    const m = p.medicoes.find(x => x.chave === chave)
    const c = !m ? '#d9d4cf' : m.ok ? cor.ok : cor.falha
    const t = m ? `${new Date(p.em).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} — ${m.ok ? 'de pé' : 'fora'}${m.ms ? ` (${m.ms} ms)` : ''}` : 'sem dado'
    return `<span class="tick" style="background:${c}" title="${t}"></span>`
  }).join('')
}

const pctTexto = v => (v == null ? '—' : `${v.toFixed(v >= 99.9 ? 2 : 1)}%`)

const cartoes = medicoes.map(m => {
  const e = estadoDe(m)
  const componentes = (m.componentes ?? []).map(c => {
    const cc = cor[c.estado] ?? '#d9d4cf'
    return `<li><span class="dot" style="background:${cc}"></span>${c.nome}${c.ms != null ? ` <em>${c.ms} ms</em>` : ''}</li>`
  }).join('')
  return `
  <article class="cartao">
    <header>
      <span class="dot grande" style="background:${cor[e]}"></span>
      <h2>${m.nome}</h2>
      <span class="estado" style="color:${cor[e]}">${m.ok ? 'De pé' : 'Fora do ar'}</span>
    </header>
    <p class="meta">
      ${m.status ? `HTTP ${m.status}` : (m.erro ?? 'sem resposta')} · ${m.ms} ms
      ${m.recuperouNaSegunda ? ' · respondeu na segunda tentativa' : ''}
    </p>
    ${componentes ? `<ul class="componentes">${componentes}</ul>` : ''}
    <div class="faixa">${faixa(m.chave)}</div>
    <p class="meta">24 h: <b>${pctTexto(disponibilidade(m.chave, 24))}</b> · 7 dias: <b>${pctTexto(disponibilidade(m.chave, 24 * 7))}</b></p>
  </article>`
}).join('')

const algoFora = medicoes.some(m => !m.ok)
const criticoFora = medicoes.some(m => !m.ok && ALVOS.find(a => a.chave === m.chave)?.critico)

const html = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Status — Hannover Cidadania Alemã</title>
<style>
  :root { --texto:#15181b; --fundo:#f4f2f0; --caixa:#fefefe; --borda:#e6e2de; --fraco:#6c6864; }
  @media (prefers-color-scheme: dark) {
    :root { --texto:#f2efec; --fundo:#15181b; --caixa:#1e2226; --borda:#2c3238; --fraco:#9a948e; }
  }
  * { box-sizing:border-box }
  body { margin:0; background:var(--fundo); color:var(--texto);
         font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
         padding:40px 20px }
  .largura { max-width:900px; margin:0 auto }
  .selo { font:700 11px/1 sans-serif; letter-spacing:.18em; text-transform:uppercase; color:#ff293e }
  h1 { font-size:26px; margin:8px 0 4px }
  .resumo { font-size:15px; color:var(--fraco); margin:0 0 28px }
  .cartao { background:var(--caixa); border:1px solid var(--borda); border-radius:6px;
            padding:18px 20px; margin-bottom:14px }
  .cartao header { display:flex; align-items:center; gap:10px; margin-bottom:8px; flex-wrap:wrap }
  .cartao h2 { font-size:16px; margin:0; flex:1 }
  .estado { font:700 12px/1 sans-serif; text-transform:uppercase; letter-spacing:.08em }
  .dot { width:10px; height:10px; border-radius:50%; display:inline-block; flex-shrink:0 }
  .dot.grande { width:13px; height:13px }
  .meta { font-size:12.5px; color:var(--fraco); margin:6px 0 0 }
  .componentes { list-style:none; padding:0; margin:10px 0 0; display:flex; flex-wrap:wrap; gap:6px 16px }
  .componentes li { font-size:12.5px; display:flex; align-items:center; gap:6px }
  .componentes em { color:var(--fraco); font-style:normal }
  .faixa { display:flex; gap:2px; margin-top:12px; height:26px; align-items:stretch; overflow:hidden }
  .tick { flex:1 1 0; min-width:2px; border-radius:1px }
  footer { margin-top:26px; font-size:12.5px; color:var(--fraco) }
  code { background:var(--borda); padding:1px 5px; border-radius:3px; font-size:12px }
</style>
</head><body><div class="largura">
  <div class="selo">Hannover Cidadania Alemã</div>
  <h1>Status dos sistemas</h1>
  <p class="resumo">
    ${algoFora ? 'Há sistema fora do ar agora.' : 'Todos os sistemas de pé.'}
    Verificado a cada 5 minutos por um vigia que roda no GitHub, fora da
    infraestrutura vigiada. Última verificação:
    ${new Date(agora).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (Brasília).
  </p>
  ${cartoes}
  <footer>
    Cada barrinha é uma verificação, as 8 horas mais recentes à direita.
    O CRM é medido pelo endereço <code>/api/saude</code>, que executa consulta de
    verdade no banco em vez de apenas responder que está de pé.
    Esta página não mostra nenhum dado de cliente.
  </footer>
</div></body></html>`

writeFileSync('docs/index.html', html)

// STATUS.md existe porque o repositório é PRIVADO: HTML em repositório privado não
// é renderizado pelo github.com, mas Markdown é. Então este arquivo é a versão que
// o Fabio consegue abrir do celular quando TODO o resto está fora do ar, que é
// exatamente a hora em que ele vai querer olhar.
const emoji = m => (m.ok ? '🟢' : '🔴')
const md = `# Status dos sistemas

**${algoFora ? '🔴 Há sistema fora do ar.' : '🟢 Todos os sistemas de pé.'}**
Última verificação: ${new Date(agora).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (Brasília).

| Sistema | Agora | Resposta | 24 h | 7 dias |
|---|---|---|---|---|
${medicoes.map(m => `| ${m.nome} | ${emoji(m)} ${m.ok ? 'de pé' : 'fora'} | ${m.status ?? (m.erro ?? 'sem resposta')} · ${m.ms} ms | ${pctTexto(disponibilidade(m.chave, 24))} | ${pctTexto(disponibilidade(m.chave, 24 * 7))} |`).join('\n')}

## Peças do CRM na última medição

${(medicoes.find(m => m.chave === 'crm')?.componentes ?? []).length === 0
  ? '_O CRM não devolveu o detalhe das peças._'
  : (medicoes.find(m => m.chave === 'crm')?.componentes ?? [])
      .map(c => `- ${c.estado === 'ok' ? '🟢' : c.estado === 'atencao' ? '🟡' : '🔴'} **${c.nome}**${c.ms != null ? ` — ${c.ms} ms` : ''}`)
      .join('\n')}

---
Verificado a cada 30 minutos por um vigia que roda no GitHub, fora da Vercel e fora
da Supabase. Quando um sistema crítico está fora, este job falha de propósito e o
GitHub manda e-mail. Nenhum dado de cliente aparece aqui.
`
writeFileSync('STATUS.md', md)

const linha = medicoes.map(m => `${m.nome}: ${m.ok ? 'ok' : 'FORA'} (${m.status ?? 'sem resposta'}, ${m.ms}ms)`).join(' · ')
console.log(linha)

if (criticoFora) {
  console.error('\nALERTA: sistema crítico fora do ar. A falha deste job é o aviso.')
  process.exit(1)
}
