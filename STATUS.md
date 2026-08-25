# Status dos sistemas

**🟢 Todos os sistemas de pé.**
Última verificação: 25/08/2026, 16:39:54 (Brasília).

| Sistema | Agora | Resposta | 24 h | 7 dias |
|---|---|---|---|---|
| CRM | 🟢 de pé | 200 · 4791 ms | 100.00% | 96.4% |
| Site Hannover | 🟢 de pé | 200 · 223 ms | 100.00% | 100.00% |
| Site Viena | 🟢 de pé | 200 · 264 ms | 100.00% | 100.00% |
| Site German Citizenship | 🟢 de pé | 200 · 231 ms | 100.00% | 100.00% |
| Site Werlang | 🟢 de pé | 200 · 171 ms | 100.00% | 100.00% |

## Peças do CRM na última medição

- 🟢 **Banco de dados** · 1530 ms · sonda de CPU dentro do teto
- 🟢 **Inbox** · 777 ms · lista de conversas dentro do teto
- 🟢 **Anexos** · 653 ms · bucket de anexos respondendo
- 🟢 **WhatsApp (Z-API)** · entrada de mensagens dentro do esperado
- 🟢 **Conta Azul** · credencial válida; o token vence a cada 1 h e é renovado sob demanda, vencido não é falha
- 🟢 **Clicksign** · cron sincronizando
- 🟢 **ClickUp (processos)** · cron diário em dia
- 🟢 **Instagram e Messenger** · ponte em dia: as duas pontas concordam
- 🟢 **Tabela de valores (site x CRM)** · as duas fontes batem

---
Agendado a cada 5 minutos num vigia que roda no GitHub, fora da Vercel e fora da
Supabase. O GitHub atrasa e pula agendamentos, então na prática as medições saem a
cada 20 a 40 minutos: não conte com os 5 minutos. Quando um sistema crítico está
FORA, este job falha de propósito e o GitHub manda e-mail; integração de terceiro
fora aparece em amarelo e NÃO dispara aviso. Nenhum dado de cliente aparece aqui.
