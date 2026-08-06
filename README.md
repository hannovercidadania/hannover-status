# Vigia da Hannover

Monitoramento externo do CRM e dos sites da Hannover Cidadania Alemã.

**Status atual:** [STATUS.md](STATUS.md), atualizado a cada verificação.

## Por que fora da própria infraestrutura

Um monitor que roda no mesmo lugar que ele vigia cai junto com o que deveria
vigiar. Cron hospedado na Vercel não avisa quando a Vercel engasga, e verificação
que consulta o banco não avisa quando o banco para.

Este vigia roda no **GitHub Actions**, que não é nenhum dos dois.

## O que ele mede

| Alvo | Como | Crítico |
|---|---|---|
| CRM | `/api/saude`, que **executa** a consulta real da lista de conversas e um cálculo puro no banco | sim |
| Site Hannover | página inicial | sim |
| Sites Viena, German Citizenship e Werlang | página inicial | não |

O endereço de saúde do CRM responde **502** quando alguma peça está em falha, então
o vigia decide pelo código HTTP.

**Medir o trabalho, não a porta.** Uma rota protegida responde 401 em milissegundos
sem tocar no banco: cronometrar isso dá a impressão de saúde mesmo com o sistema
inutilizável. Por isso o endereço de saúde executa trabalho de verdade.

## Como o aviso chega

Quando um alvo **crítico** está fora, o job **falha de propósito**, e o GitHub
notifica por e-mail. Sem SMTP, sem segredo e sem serviço de terceiro para manter.

O que falha uma vez é medido de novo 4 segundos depois. Blip de rede na máquina do
Actions não pode virar alarme: alarme falso ensina a ignorar o alarme.

## O que não aparece aqui

Nenhum dado de cliente e nenhum número do negócio. A página mostra o estado de cada
peça e o tempo de resposta. O detalhe operacional fica no CRM, atrás de login.
