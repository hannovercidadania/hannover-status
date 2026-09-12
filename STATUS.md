# Status dos sistemas

**🟢 Todos os sistemas de pé.**
Última verificação: 12/09/2026, 12:39:56 (Brasília).

| Sistema | Agora | Resposta | 24 h | 7 dias |
|---|---|---|---|---|
| CRM | 🟢 de pé | 200 · 3597 ms | 100.00% | 100.00% |
| Site Hannover | 🟢 de pé | 200 · 155 ms | 100.00% | 100.00% |
| Site Viena | 🟢 de pé | 200 · 381 ms | 100.00% | 100.00% |
| Site German Citizenship | 🟢 de pé | 200 · 76 ms | 100.00% | 100.00% |
| Site Werlang | 🟢 de pé | 200 · 155 ms | 100.00% | 100.00% |

## Peças do CRM na última medição

- 🟢 **Banco de dados** · 649 ms · sonda de CPU dentro do teto
- 🟢 **Inbox** · 205 ms · lista de conversas dentro do teto
- 🟢 **Anexos** · 56 ms · bucket de anexos respondendo
- 🟢 **WhatsApp (Z-API)** · entrada de mensagens dentro do esperado
- 🟢 **Conta Azul** · credencial válida; o token vence a cada 1 h e é renovado sob demanda, vencido não é falha
- 🟢 **Clicksign** · cron sincronizando
- 🟢 **Conta Azul (clientes)** · cron diário em dia
- 🟢 **ClickUp (processos)** · cron diário em dia
- 🟢 **Planilha de envios** · cron diário em dia
- 🟢 **Instagram e Messenger** · ponte em dia: as duas pontas concordam
- 🟢 **Tabela de valores (site x CRM)** · as duas fontes batem

---
Agendado a cada 5 minutos num vigia que roda no GitHub, fora da Vercel e fora da
Supabase. O GitHub atrasa e pula agendamentos, então na prática as medições saem a
cada 20 a 40 minutos: não conte com os 5 minutos. Quando um sistema crítico está
FORA, este job falha de propósito e o GitHub manda e-mail; integração de terceiro
fora aparece em amarelo e NÃO dispara aviso. Nenhum dado de cliente aparece aqui.
