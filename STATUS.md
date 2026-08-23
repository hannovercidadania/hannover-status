# Status dos sistemas

**🟢 Todos os sistemas de pé.**
Última verificação: 23/08/2026, 04:44:19 (Brasília).

| Sistema | Agora | Resposta | 24 h | 7 dias |
|---|---|---|---|---|
| CRM | 🟢 de pé | 200 · 2857 ms | 98.1% | 93.3% |
| Site Hannover | 🟢 de pé | 200 · 197 ms | 100.00% | 100.00% |
| Site Viena | 🟢 de pé | 200 · 271 ms | 100.00% | 100.00% |
| Site German Citizenship | 🟢 de pé | 200 · 177 ms | 100.00% | 100.00% |
| Site Werlang | 🟢 de pé | 200 · 249 ms | 100.00% | 100.00% |

## Peças do CRM na última medição

- 🟢 **Banco de dados** · 730 ms · sonda de CPU dentro do teto
- 🟢 **Inbox** · 698 ms · lista de conversas dentro do teto
- 🟢 **Anexos** · 440 ms · bucket de anexos respondendo
- 🟡 **WhatsApp (Z-API)** · sem mensagem de entrada na janela (normal fora do expediente)
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
