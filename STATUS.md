# Status dos sistemas

**🟢 Todos os sistemas de pé.**
Última verificação: 22/08/2026, 10:03:26 (Brasília).

| Sistema | Agora | Resposta | 24 h | 7 dias |
|---|---|---|---|---|
| CRM | 🟢 de pé | 200 · 3205 ms | 93.6% | 93.4% |
| Site Hannover | 🟢 de pé | 200 · 294 ms | 100.00% | 100.00% |
| Site Viena | 🟢 de pé | 200 · 433 ms | 100.00% | 100.00% |
| Site German Citizenship | 🟢 de pé | 200 · 195 ms | 100.00% | 100.00% |
| Site Werlang | 🟢 de pé | 200 · 437 ms | 100.00% | 100.00% |

## Peças do CRM na última medição

- 🟢 **Banco de dados** — 753 ms
- 🟢 **Inbox** — 727 ms
- 🟢 **Anexos** — 151 ms
- 🟢 **WhatsApp (Z-API)**
- 🟢 **Conta Azul**
- 🟢 **Clicksign**
- 🟢 **ClickUp (processos)**
- 🟢 **Instagram e Messenger**
- 🟢 **Tabela de valores (site x CRM)**

---
Agendado a cada 5 minutos num vigia que roda no GitHub, fora da Vercel e fora da
Supabase. O GitHub atrasa e pula agendamentos, então na prática as medições saem a
cada 20 a 40 minutos: não conte com os 5 minutos. Quando um sistema crítico está
FORA, este job falha de propósito e o GitHub manda e-mail; integração de terceiro
fora aparece em amarelo e NÃO dispara aviso. Nenhum dado de cliente aparece aqui.
