import React, { useState, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Globe,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface InstallApkScreenProps {
  onOpenWebPortal?: () => void;
}

export const InstallApkScreen: React.FC<InstallApkScreenProps> = ({ onOpenWebPortal }) => {
  const {
    salonName,
    clients,
    activeClientForPortal,
    getDirectApkUrl,
    openWhatsApp,
    switchMode,
    isSupabaseRealtimeEnabled,
  } = useSalon();

  const [clientGreeting, setClientGreeting] = useState<string>('');
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        const found = clients.find(
          (c) => c.token === token || c.phone.includes(token.replace('cli_', ''))
        );
        if (found) {
          setClientGreeting(found.name);
        }
      } else if (activeClientForPortal) {
        setClientGreeting(activeClientForPortal.name);
      }
    }
  }, [clients, activeClientForPortal]);

  const directApkUrl = getDirectApkUrl ? getDirectApkUrl() : '/portal-cliente.apk';

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = directApkUrl;
    link.download = 'vanira_e_vanessa_portal_cliente.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenWeb = () => {
    if (onOpenWebPortal) {
      onOpenWebPortal();
    } else {
      switchMode('CLIENT_PORTAL');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/?mode=client&client_only=true');
      }
    }
  };

  const handleContactSalon = () => {
    openWhatsApp(
      '5511999999999',
      `Olá! Estou na página de instalação do Aplicativo do ${salonName} e gostaria de tirar uma dúvida sobre a instalação do APK no meu celular!`
    );
  };

  return (
    <div className="min-h-screen bg-[#FCF8F9] dark:bg-[#120D10] text-gray-900 dark:text-[#F3ECF0] py-8 px-4 flex flex-col justify-between max-w-lg mx-auto transition-colors duration-200">
      <div className="space-y-5">
        {/* Salon Brand Card */}
        <div className="bg-gradient-to-br from-[#6B1D4B] via-[#85275E] to-[#9E5471] rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-3xl shadow-inner mb-3">
            💇‍♀️
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{salonName}</h1>
          <p className="text-xs text-pink-100 font-semibold opacity-90 mt-1">
            Aplicativo Oficial do Salão &bull; Portal do Cliente
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white border border-emerald-400/50 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Conectado à mesma base de dados em tempo real</span>
          </div>

          {clientGreeting && (
            <div className="mt-3 bg-white/15 backdrop-blur-xs rounded-xl py-1.5 px-3 inline-block text-xs font-bold text-pink-50">
              ✨ Bem-vinda, {clientGreeting}!
            </div>
          )}
        </div>

        {/* Primary Download Card */}
        <div className="bg-white dark:bg-[#1C141A] rounded-3xl p-6 border border-pink-100 dark:border-[#382633] shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5 text-[#6B1D4B] dark:text-pink-400" />
              <span>Instalar Aplicativo no Celular</span>
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Tenha acesso direto aos serviços, horários e equipe de <strong>Vanira e Vanessa</strong> com confirmação instantânea na agenda do salão.
            </p>
          </div>

          {/* Download APK Big Button */}
          <button
            onClick={handleDownload}
            className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-emerald-600 active:scale-98 transition shadow-md text-white flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                📲
              </div>
              <div>
                <p className="font-extrabold text-sm leading-tight">
                  Baixar e Instalar APK no Celular
                </p>
                <p className="text-[11px] opacity-90 font-medium">
                  Arquivo Android Oficial (.APK &bull; ~22 MB)
                </p>
              </div>
            </div>
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition" />
          </button>

          {downloadStarted && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Download iniciado! Abra a notificação no topo do seu celular ou a pasta Downloads para instalar.
              </span>
            </div>
          )}

          {/* Real-time Connection Highlights */}
          <div className="bg-pink-50/70 dark:bg-[#251A22] p-3.5 rounded-2xl border border-pink-100 dark:border-[#3D2938] space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <p className="font-bold text-[#6B1D4B] dark:text-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vantagens do Aplicativo Instalado:</span>
            </p>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Sincronização em tempo real:</strong> Vagas e horários ao vivo.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Escolha especialistas:</strong> Vanira, Vanessa e equipe.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Acesso rápido:</strong> Ícone direto na tela inicial do celular.</span>
              </li>
            </ul>
          </div>

          {/* Alternative Web Option */}
          <div className="pt-2 border-t border-gray-100 dark:border-[#30212C] flex flex-col gap-2">
            <button
              onClick={handleOpenWeb}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#6B1D4B] dark:text-pink-300 bg-pink-50 dark:bg-[#251A22] hover:bg-pink-100 dark:hover:bg-[#2E1F2A] border border-pink-200 dark:border-[#3D2938] transition flex items-center justify-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Abrir no Navegador (iPhone / Sem Instalar)</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Installation Guide */}
        <div className="bg-white dark:bg-[#1C141A] rounded-3xl p-5 border border-pink-100 dark:border-[#382633] shadow-sm space-y-3">
          <h3 className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            <span>📖 Passo a Passo para Instalar o APK:</span>
          </h3>

          <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#251A22] border border-gray-100 dark:border-[#382633]">
              <span className="w-6 h-6 rounded-full bg-[#6B1D4B] dark:bg-[#85275E] text-white font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">Toque em "Baixar e Instalar APK"</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  O download do arquivo <code>.apk</code> começará automaticamente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#251A22] border border-gray-100 dark:border-[#382633]">
              <span className="w-6 h-6 rounded-full bg-[#6B1D4B] dark:bg-[#85275E] text-white font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">Abra a Notificação de Conclusão</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Puxe a barra de notificações do celular ou abra a pasta "Downloads".
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#251A22] border border-gray-100 dark:border-[#382633]">
              <span className="w-6 h-6 rounded-full bg-[#6B1D4B] dark:bg-[#85275E] text-white font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">Permita e Instale</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Se o celular exibir aviso de segurança, clique em "Permitir desta fonte" e toque em <strong>Instalar</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                ✓
              </span>
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-300">Pronto! Base Conectada!</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  O app estará pronto na tela do seu celular, sincronizado em tempo real com a agenda do salão!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Support Help */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-emerald-950 dark:text-emerald-200">Precisa de ajuda para instalar?</p>
            <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">Nossa equipe no WhatsApp te auxilia em minutos!</p>
          </div>
          <button
            onClick={handleContactSalon}
            className="px-3 py-2 rounded-xl font-bold bg-[#25D366] text-white hover:bg-emerald-600 transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar no Zap</span>
          </button>
        </div>
      </div>

      <footer className="text-center py-4 text-[11px] text-gray-400 dark:text-gray-500">
        {salonName} &bull; Aplicativo Android Oficial Conectado em Tempo Real
      </footer>
    </div>
  );
};
