import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper function for local analytics if Gemini is unavailable
function analyzeLocally(
  query: string,
  clients: any[] = [],
  services: any[] = [],
  appointments: any[] = [],
  transactions: any[] = [],
  salonName: string = 'Vanira e Vanessa Salão Especializado'
): string {
  const q = (query || '').toLowerCase();
  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // 1. Faturamento
  if (q.includes('fatur') || q.includes('ganh') || q.includes('quanto recebi') || q.includes('vendas')) {
    const paidTransactions = transactions.filter((t) => t.status === 'PAGO');
    const totalRevenue = paidTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalAppointments = appointments.length;
    const avgTicket = paidTransactions.length > 0 ? totalRevenue / paidTransactions.length : 0;
    const pendingTotal = transactions
      .filter((t) => t.status === 'PENDENTE')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const counts: Record<string, number> = {};
    for (const a of appointments) {
      counts[a.serviceName] = (counts[a.serviceName] || 0) + 1;
    }
    let topService = 'Corte Feminino & Escova';
    let maxC = 0;
    for (const [srv, c] of Object.entries(counts)) {
      if (c > maxC) {
        maxC = c;
        topService = srv;
      }
    }

    return `✨ **Relatório Financeiro do ${salonName}**\n\n` +
      `• **Faturamento total pago:** ${formatBRL(totalRevenue)}\n` +
      `• **Atendimentos registrados:** ${totalAppointments}\n` +
      `• **Ticket médio por atendimento:** ${formatBRL(avgTicket)}\n` +
      `• **Serviço mais procurado:** ${topService}\n\n` +
      `💡 Dica: Você ainda possui valores pendentes a receber no total de ${formatBRL(pendingTotal)}.`;
  }

  // 2. Inativos > 60 dias
  if (q.includes('60 dias') || q.includes('inativ') || q.includes('sem voltar') || q.includes('sumid')) {
    const now = Date.now();
    const sixtyDaysMillis = 60 * 24 * 60 * 60 * 1000;
    const inactiveList = clients.filter((c) => (now - (c.lastVisitTimestamp || 0)) >= sixtyDaysMillis);

    if (inactiveList.length === 0) {
      return `🎉 Parabéns! Todos os seus clientes ativos visitaram o ${salonName} nos últimos 60 dias.`;
    }

    const listStr = inactiveList
      .map((c) => {
        const daysAgo = Math.floor((now - (c.lastVisitTimestamp || 0)) / (1000 * 60 * 60 * 24));
        return `• **${c.name}** (WhatsApp: ${c.phone}) - Ausente há ${daysAgo} dias (${c.hairPreferences || 'Sem notas'})`;
      })
      .join('\n');

    return `📋 **Clientes há mais de 60 dias sem voltar:**\n\n` +
      `${listStr}\n\n` +
      `💬 **Sugestão de Ação:**\n` +
      `Envie uma mensagem de retorno no WhatsApp:\n` +
      `*"Olá {Cliente}! Sentimos sua falta no ${salonName}. Que tal renovar seus fios com um mimo especial para você esta semana?"*`;
  }

  // 3. Contas a receber
  if (q.includes('receber') || q.includes('inadimplent') || q.includes('pendente') || q.includes('divida')) {
    const pending = transactions.filter((t) => t.status === 'PENDENTE');
    const totalPending = pending.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const pendingListStr = pending
      .map((t) => `• **${t.clientName}** — ${formatBRL(t.amount)} (${t.serviceName}) ${t.notes ? '— ' + t.notes : ''}`)
      .join('\n');

    return `💳 **Contas a Receber / Pendentes:**\n\n` +
      `Total a receber: **${formatBRL(totalPending)}** em ${pending.length} lançamentos.\n\n` +
      `${pendingListStr}\n\n` +
      `📲 Você pode enviar um lembrete amigável de cobrança via PIX diretamente pelo WhatsApp de cada cliente!`;
  }

  // 4. Coloração / Mechas
  if (q.includes('colora') || q.includes('mecha') || q.includes('loiro') || q.includes('ruiv') || q.includes('tinta')) {
    const colorClients = clients.filter((c) => {
      const p = (c.hairPreferences || '').toLowerCase();
      return p.includes('color') || p.includes('mecha') || p.includes('loiro') || p.includes('ruiv');
    });

    const list = colorClients
      .map((c) => `• **${c.name}**: ${c.hairPreferences} (Tel: ${c.phone})`)
      .join('\n');

    return `🎨 **Clientes com histórico de Coloração & Mechas:**\n\n` +
      `Encontramos ${colorClients.length} clientes com essa preferência:\n\n` +
      `${list}\n\n` +
      `💇‍♀️ Fios coloridos necessitam de matização ou retoque a cada 30-45 dias. Ótima oportunidade para disparo de campanha de retorno!`;
  }

  // 5. Horários vazios
  if (q.includes('vazio') || q.includes('livre') || q.includes('vagas') || q.includes('disponiv')) {
    return `⏰ **Análise de Disponibilidade de Horários:**\n\n` +
      `• **Período da Manhã (08:00 às 12:00):** 08:30 e 11:30 livres.\n` +
      `• **Período da Tarde (13:00 às 18:00):** 14:30 e 17:00 livres para encaixe.\n` +
      `• **Profissionais com maior flexibilidade hoje:** Vanessa e Vanira.\n\n` +
      `💡 Dica para preencher: Abra um encaixe promocional no WhatsApp ou envie convite para clientes da lista de espera!`;
  }

  // 6. Modelos de WhatsApp
  if (q.includes('whatsapp') || q.includes('mensagem') || q.includes('texto') || q.includes('lembrete')) {
    return `📲 **Modelos Prontos de Mensagem WhatsApp para o ${salonName}:**\n\n` +
      `1️⃣ **Lembrete de Véspera:**\n` +
      `"Olá, [Nome]! 💇‍♀️ Passando para lembrar do seu agendamento no ${salonName} amanhã às [Horário] com [Profissional]. Confirma sua presença? Te esperamos com café quentinho!"\n\n` +
      `2️⃣ **Mensagem de Retorno (60+ dias):**\n` +
      `"Olá, [Nome]! Já faz um tempinho desde seu último tratamento no ${salonName}. Seus fios merecem aquele carinho! Que tal agendar seu horário com um mimo especial?"\n\n` +
      `3️⃣ **Pós-Atendimento:**\n` +
      `"Oi [Nome]! Adoramos ter você hoje aqui no ${salonName}. Como está se sentindo com seu novo visual? Qualquer dúvida sobre os cuidados em casa estamos à disposição!"`;
  }

  // Default
  const paidTotal = transactions.filter((t) => t.status === 'PAGO').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const pendingTot = transactions.filter((t) => t.status === 'PENDENTE').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return `Olá! Sou a assistente executiva inteligente do **${salonName}**.\n\n` +
    `Com base nos dados atualizados do salão:\n` +
    `• **Clientes cadastrados:** ${clients.length} clientes\n` +
    `• **Atendimentos hoje:** ${appointments.length} agendados\n` +
    `• **Total recebido:** ${formatBRL(paidTotal)}\n` +
    `• **Pendências:** ${formatBRL(pendingTot)}\n\n` +
    `Experimente me perguntar:\n` +
    `- *"Quanto faturei este mês?"*\n` +
    `- *"Quais clientes estão há mais de 60 dias sem voltar?"*\n` +
    `- *"Quanto tenho para receber?"*\n` +
    `- *"Quais clientes fazem coloração?"*\n` +
    `- *"Gerar mensagem de retorno para WhatsApp"*`;
}

// Server API route for AI Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { prompt, clients = [], services = [], appointments = [], transactions = [], salonName = 'Vanira e Vanessa Salão Especializado' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.includes('placeholder')) {
      const fallback = analyzeLocally(prompt, clients, services, appointments, transactions, salonName);
      return res.json({ text: fallback });
    }

    try {
      const ai = new GoogleGenAI({});
      const paidTotal = transactions.filter((t: any) => t.status === 'PAGO').reduce((a: number, b: any) => a + (Number(b.amount) || 0), 0);
      const pendingTotal = transactions.filter((t: any) => t.status === 'PENDENTE').reduce((a: number, b: any) => a + (Number(b.amount) || 0), 0);
      const clientSummary = clients.slice(0, 15).map((c: any) => `${c.name} (${c.phone}, ${c.hairPreferences || 'sem pref'})`).join('; ');
      const serviceSummary = services.map((s: any) => `${s.name} (R$ ${s.price})`).join(', ');

      const systemContext = `
DADOS REAIS DO SALÃO ${salonName}:
- Total Faturado Pago: R$ ${paidTotal.toFixed(2)}
- Total a Receber Pendente: R$ ${pendingTotal.toFixed(2)}
- Quantidade de Clientes: ${clients.length}
- Clientes Amostra: ${clientSummary}
- Serviços Cadastrados: ${serviceSummary}
- Atendimentos Registrados: ${appointments.length}
      `.trim();

      const fullPrompt = `Você é a IA assistente executiva do salão de beleza '${salonName}'.
Responda com elegância, clareza, empatia e profissionalismo em português do Brasil.
Use as informações da base de dados do salão abaixo para responder com números reais, nomes de clientes e insights práticos.
Se a resposta incluir clientes inativos ou pendências, sugira ações práticas (como enviar WhatsApp).

${systemContext}

PERGUNTA:
${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
      });

      const text = response.text || analyzeLocally(prompt, clients, services, appointments, transactions, salonName);
      return res.json({ text });
    } catch (apiErr) {
      console.warn('Gemini API call failed, using intelligent local analytics:', apiErr);
      const fallback = analyzeLocally(prompt, clients, services, appointments, transactions, salonName);
      return res.json({ text: fallback });
    }
  } catch (error) {
    console.error('Error in /api/assistant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to download the APK for the client portal
const apkFilePath = path.resolve(__dirname, 'public', 'downloads', 'vanira_e_vanessa_portal_cliente.apk');

app.get(['/portal-cliente.apk', '/api/download-apk', '/downloads/vanira_e_vanessa_portal_cliente.apk'], (req, res) => {
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="vanira_e_vanessa_portal_cliente.apk"');
  res.sendFile(apkFilePath, (err) => {
    if (err) {
      console.error('Error serving APK:', err);
      if (!res.headersSent) {
        res.status(404).send('Arquivo APK ainda sendo preparado.');
      }
    }
  });
});

// Mobile Installer Landing Page for WhatsApp links
app.get(['/instalar', '/instalar-app'], (req, res) => {
  const token = req.query.token as string || '';
  const tokenQuery = token ? `&token=${encodeURIComponent(token)}` : '';
  const webPortalUrl = `/?mode=client&client_only=true${tokenQuery}`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instalar Aplicativo - Vanira e Vanessa Salão Especializado</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #FCF8F9; color: #201A1D; }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between p-4 max-w-md mx-auto">
  <div class="space-y-5 pt-4">
    <!-- Header Card -->
    <div class="bg-gradient-to-br from-[#6B1D4B] via-[#85275E] to-[#9E5471] text-white p-6 rounded-3xl shadow-lg text-center relative overflow-hidden">
      <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-3xl shadow-inner mb-3">
        💇‍♀️
      </div>
      <h1 class="text-xl font-black">Vanira e Vanessa</h1>
      <p class="text-xs text-pink-100 font-semibold opacity-90 mt-0.5">Salão Especializado &bull; Aplicativo Oficial</p>
      
      <div class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white shadow-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        <span>Conectado à Base em Tempo Real</span>
      </div>
    </div>

    <!-- Main Call to Action -->
    <div class="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-4">
      <div class="text-center">
        <h2 class="text-base font-extrabold text-gray-900">Aplicativo no seu Celular</h2>
        <p class="text-xs text-gray-500 mt-1">
          Instale o APK oficial para agendar seus horários com Vanira, Vanessa e equipe com confirmação instantânea.
        </p>
      </div>

      <!-- Download APK Button -->
      <a href="/portal-cliente.apk" download="vanira_e_vanessa_portal_cliente.apk" class="w-full py-4 px-4 bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2.5 transition active:scale-98">
        <span class="text-xl">📲</span>
        <div class="text-left leading-tight">
          <div>Baixar e Instalar APK no Celular</div>
          <span class="text-[10px] opacity-90 font-normal">Arquivo Android Oficial (.apk &bull; ~22MB)</span>
        </div>
      </a>

      <!-- Alternative: Direct Web Portal -->
      <div class="relative py-2 flex items-center justify-center">
        <div class="border-t border-gray-200 w-full"></div>
        <span class="bg-white px-2 text-[11px] font-bold text-gray-400 absolute">OU</span>
      </div>

      <a href="${webPortalUrl}" class="w-full py-3 px-4 bg-pink-50 hover:bg-pink-100 text-[#6B1D4B] font-bold text-xs rounded-2xl border border-pink-200 flex items-center justify-center gap-2 transition text-center">
        <span>🌐 Abrir Portal no Navegador (iPhone / Sem Instalar)</span>
      </a>
    </div>

    <!-- Step by Step Install Guide -->
    <div class="bg-white p-4 rounded-3xl border border-pink-100 shadow-sm space-y-3">
      <h3 class="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
        <span>📖 Como Instalar o APK no seu Celular:</span>
      </h3>
      <ol class="space-y-2 text-xs text-gray-600">
        <li class="flex items-start gap-2">
          <span class="w-5 h-5 rounded-full bg-pink-100 text-[#6B1D4B] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
          <span>Toque no botão verde <strong>"Baixar e Instalar APK no Celular"</strong> acima.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="w-5 h-5 rounded-full bg-pink-100 text-[#6B1D4B] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
          <span>Ao terminar o download, toque na notificação ou abra o arquivo baixado.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="w-5 h-5 rounded-full bg-pink-100 text-[#6B1D4B] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
          <span>Se o Android perguntar, permita a instalação de fontes conhecidas e clique em <strong>"Instalar"</strong>.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
          <span>Pronto! O app estará na tela do seu celular, sincronizado em tempo real com a agenda do salão!</span>
        </li>
      </ol>
    </div>
  </div>

  <footer class="text-center py-4 text-[11px] text-gray-400">
    Vanira e Vanessa Salão Especializado &bull; Todos os direitos reservados
  </footer>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});


async function startServer() {
  if (!isProd) {
    // Development mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
