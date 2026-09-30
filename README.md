# Vanira e Vanessa - Gestão de Salão & Portal do Cliente (Android)

Aplicativo Android nativo moderno desenvolvido com **Kotlin** e **Jetpack Compose** (Material Design 3) para gestão integral de salão de beleza e estética capilar, com agendamentos, clientes, finanças, estoque, profissionais, portal do cliente e consultoria inteligente.

## Tecnologias & Arquitetura

- **Kotlin 2.1.0**
- **Jetpack Compose & Material Design 3 (M3)**
- **Arquitetura MVVM (Model-View-ViewModel)** com Coroutines e `StateFlow`
- **Gradle Kotlin DSL (.gradle.kts)** com Version Catalog (`gradle/libs.versions.toml`)
- **Design Adaptativo & Edge-to-Edge (`enableEdgeToEdge`)**
- **Ícones Adaptativos Customizados Material You** (`ic_launcher` & `ic_launcher_round`)
- **Intents Nativas do Android**:
  - Disparos diretos para **WhatsApp** com mensagens personalizadas de confirmação e pós-atendimento
  - Adição direta de agendamentos ao **Google Agenda** do dispositivo

## Funcionalidades Principais

1. **Painel de Controle (Dashboard)**:
   - Banner visual do salão com cabeçalho de boas-vindas.
   - Contadores diários em tempo real (Total de atendimentos, Confirmados, Aguardando, Cancelados).
   - Indicadores financeiros (Faturamento do mês, Faturamento do dia e Contas a receber).
   - Grade de ações rápidas para novos agendamentos, novos clientes e novos serviços.
   - Lista cronológica dos próximos atendimentos de hoje com cards interativos.

2. **Agenda Interativa (Schedule)**:
   - Seletor de dias da semana com abas dinâmicas.
   - Filtros rápidos por profissional (Vanira, Vanessa, Juliana, Beatriz ou todas).
   - Bloqueio de horários (intervalos de almoço ou indisponibilidade).
   - Validação inteligente contra conflito de horários no mesmo especialista.
   - Alteração ágil de status (Confirmado, Concluído, Cancelado).

3. **Gestão de Clientes**:
   - Busca instantânea por nome, telefone ou tipo de cabelo/química.
   - Ficha com perfil capilar, preferências, notas técnicas e aniversário.
   - Botão de WhatsApp direto para envio de mensagens com 1 toque.
   - Compartilhamento personalizado do portal do cliente.

4. **Cardápio de Serviços**:
   - Categorias: Cabelo, Química & Cor, Unhas e Tratamentos.
   - Preços em Real (R$), duração média em minutos e descrição visagista.
   - Cadastro e exclusão de novos serviços.

5. **Financeiro & Fluxo de Caixa**:
   - Controle de lançamentos de atendimentos e recebimentos avulsos.
   - Status de pagamento: Pago ou Pendente.
   - Formas de pagamento: PIX, Cartão de Crédito, Cartão de Débito, Dinheiro.
   - Botão "Receber" com confirmação rápida da forma de pagamento.

6. **Controle de Estoque**:
   - Itens de revenda e consumo profissional (Wella, Truss, Braé, Kérastase).
   - Alerta visual para produtos abaixo do estoque mínimo.
   - Ajuste rápido de quantidade (+1 / -1) direto pelo card.

7. **Equipe de Profissionais**:
   - Perfis de especialistas (Vanira, Vanessa, Juliana Silva, Beatriz Rocha).
   - Classificação por estrelas (Rating 5.0).
   - Contato direto por WhatsApp com as cabeleireiras e manicures.

8. **IA Assistente Executiva**:
   - Consultoria em tempo real com dados da operação do salão.
   - Perguntas rápidas sobre faturamento, clientes inativos há mais de 60 dias, contas a receber, clientes de mechas/química e modelos de mensagens para WhatsApp.
   - Cópia com 1 toque para a área de transferência.

9. **Portal do Cliente ("Agende seu Horário")**:
   - Fluxo guiado em passos: Serviço -> Profissional -> Data & Horário -> Dados -> Confirmação.
   - Aba "Meus Horários" com consulta por número de WhatsApp e opção de cancelamento.
   - Aba "Dicas & IA" com recomendações de cronograma capilar e cuidados com química.
   - Modo quiosque protegido por PIN administrativo (1234) para alternar entre salão e cliente.

10. **Segurança & Dados**:
    - Backup local e opção de restauração rápida para dados de demonstração.
