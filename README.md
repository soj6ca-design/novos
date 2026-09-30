# Vanira e Vanessa - Salão Especializado

Sistema inteligente de gestão para salão de beleza com agenda diária, cadastro e histórico de clientes, controle financeiro & contas a receber, gestão de estoque e produtos, portal do cliente com agendamento online em tempo real, integração para WhatsApp e IA assistente executiva.

## Tecnologias

- **React 19** + **TypeScript**
- **Vite** + **Tailwind CSS v4**
- **Express Backend** com proxy em dev na porta 3000
- **@google/genai** SDK para assistente executiva inteligente com fallback nativo de analytics
- **Armazenamento e Sincronização**: LocalStorage com exportação/importação JSON e integração SQL / Supabase Realtime

## Funcionalidades Principais

1. **Painel de Controle (Dashboard)**: Métricas em tempo real de atendimentos do dia (confirmados, aguardando, cancelados), faturamento do mês, contas a receber, atalhos rápidos e listagem dos próximos horários.
2. **Agenda Interativa**: Visão diária por data e filtro por profissional (Vanira, Vanessa, Juliana, Beatriz), prevenção em tempo real de conflitos de horários e bloqueios de intervalos/almoço.
3. **Portal do Cliente ("Agende seu Horário")**:
   - Navegação por passos: Escolha de serviço, especialista, data e horários disponíveis em verde (horários ocupados bloqueados automaticamente em vermelho).
   - "Meus Horários": Consulta por WhatsApp, cancelamento e reagendamento seguro.
   - "Enviar Web App": Compartilhamento no WhatsApp da cliente para agendamento direto pelo celular.
   - "Dúvidas & IA": Consultora inteligente para tirar dúvidas sobre mechas, coloração, cronograma e cuidados.
4. **Clientes & Retenção**: Busca avançada por histórico e preferências capilares, alerta de clientes inativos há mais de 60 dias e disparo de mensagens personalizadas de retorno via WhatsApp.
5. **Cardápio de Serviços**: Gestão completa de valores, duração e especialistas habilitadas.
6. **Financeiro & Caixa**: Lançamentos, contas a receber, marcação de pagamento (PIX, cartões, dinheiro) e lembretes de cobrança com link PIX para WhatsApp.
7. **Estoque de Produtos**: Controle de itens para revenda e consumo interno com alerta de estoque baixo e botões rápidos de ajuste.
8. **Equipe**: Gestão das profissionais, avaliações, especialidades e status ativo na agenda.
9. **IA Assistente Executiva**: Relatórios automáticos de faturamento, ticket médio, clientes de mechas/química e geração de mensagens prontas para WhatsApp.
10. **Segurança e Nuvem**: Modo de bloqueio exclusivo de cliente com PIN administrativo (1234), backup/restauração JSON e gerador de script SQL para Supabase / PostgreSQL.
