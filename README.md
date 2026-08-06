# Vigia da Hannover

Monitoramento externo do CRM e dos sites da Hannover Cidadania Alemã.

**Como olhar:** o arquivo [STATUS.md](STATUS.md) deste repositório, atualizado a cada verificação. Markdown é renderizado pelo github.com mesmo em repositório privado, então abre do celular quando todo o resto está fora do ar.

## Por que este repositório existe separado

Em 05 e 06.08.2026 o CRM caiu duas vezes. Nas duas, a informação existia e o aviso
falhou pelo mesmo motivo: **quem devia perceber estava dentro do mesmo prédio que
caiu.** Um cron da Vercel não avisa quando a Vercel engasga, e nenhuma verificação
que consulte o Supabase avisa quando o Supabase para.

O vigia roda no **GitHub Actions**, que não é Vercel nem Supabase. É a única peça do
conjunto que sobrevive à queda do que ela vigia.

## O que ele mede

| Alvo | Como | Crítico |
|---|---|---|
| CRM | `/api/saude`, que **executa** a consulta da lista de conversas e um cálculo puro no banco | sim |
| Site Hannover | página inicial | sim |
| Site Viena, EUA, Werlang | página inicial | não |

O endereço de saúde do CRM devolve **502** quando alguma peça está em falha, então o
vigia decide pelo código HTTP.

**Medir o trabalho, e não a porta.** Foi o erro que eu cometi duas vezes: um monitor
que cronometrava rota protegida sem sessão registrou "tudo ok" com 31 ms no meio de
um apagão, porque uma rota protegida responde 401 antes de tocar no banco.

## Como o aviso chega

Quando um alvo **crítico** está fora, o job **falha de propósito**, e o GitHub manda
e-mail de falha de workflow. Sem SMTP, sem segredo, sem serviço terceiro para
manter.

O que falhou uma vez é medido de novo 4 segundos depois. Blip de rede da máquina do
Actions não pode virar alarme: alarme falso ensina a ignorar o alarme.

## O que NÃO aparece aqui

Nenhum dado de cliente e nenhum número do negócio. A página mostra estado por peça e
tempo de resposta. Detalhe operacional fica no `/status` do CRM, que exige login.
