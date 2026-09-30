import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const { salonName, getDirectApkUrl, switchMode } = useSalon();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (!isOpen) return null;

  const directApkUrl = getDirectApkUrl ? getDirectApkUrl() : '/portal-cliente.apk';

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = directApkUrl;
    link.download = 'vanira_e_vanessa_portal_cliente.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstalledSuccess(true);
      }
    } else {
      // Guide user
      alert('Para instalar na tela inicial do seu celular:\n\n1. No Chrome: Toque nos 3 pontinhos (⋮) no canto superior e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".\n\n2. No Safari (iPhone): Toque no botão de Compartilhar (quadrado com seta) e selecione "Adicionar à Tela de Início".');
    }
  };

  const handleOpenClientMode = () => {
    switchMode('CLIENT_PORTAL');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C141A] rounded-3xl p-6 shadow-2xl border border-pink-100 dark:border-[#382633] overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <img
              src="/images/icon-192.png"
              alt={salonName}
              className="w-20 h-20 rounded-2xl mx-auto shadow-md border-2 border-pink-200 dark:border-pink-900 object-cover"
              onError={(e) => {
                // fallback to emoji
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold absolute -bottom-1 -right-1 border-2 border-white dark:border-[#1C141A] shadow-xs">
              ✓
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">
              {salonName} no seu Celular
            </h3>
            <p className="text-xs text-[#9E5471] dark:text-pink-300 font-semibold">
              Aplicativo Oficial &bull; Sincronização em Tempo Real
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-5 space-y-2.5">
          {/* Option 1: Direct PWA Install to Home Screen */}
          <button
            onClick={handleInstallPwa}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6B1D4B] via-[#85275E] to-[#9E5471] hover:opacity-95 text-white font-extrabold text-sm shadow-md flex items-center justify-between group transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                📲
              </div>
              <div className="text-left">
                <p className="leading-tight font-black">Instalar Ícone na Tela Inicial</p>
                <p className="text-[11px] text-pink-100 opacity-90 font-normal">
                  Roda direto no celular como app nativo
                </p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          </button>

          {/* Option 2: Download APK */}
          <button
            onClick={handleDownloadApk}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md flex items-center justify-between group transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                🤖
              </div>
              <div className="text-left">
                <p className="leading-tight font-black">Baixar Aplicativo Android (.APK)</p>
                <p className="text-[11px] opacity-90 font-normal">
                  Arquivo para instalar no Android
                </p>
              </div>
            </div>
            <Download className="w-5 h-5 shrink-0" />
          </button>

          {/* Option 3: Open in Client Mode */}
          <button
            onClick={handleOpenClientMode}
            className="w-full py-3 px-4 rounded-2xl bg-pink-50 dark:bg-[#251A22] hover:bg-pink-100 dark:hover:bg-[#2F212C] text-[#6B1D4B] dark:text-pink-300 font-bold text-xs border border-pink-200 dark:border-[#3D2938] flex items-center justify-center gap-2 transition"
          >
            <Smartphone className="w-4 h-4" />
            <span>Abrir Modo Portal do Cliente Agora</span>
          </button>
        </div>

        {downloadStarted && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Download do APK iniciado! Abra as notificações do celular para instalar.
            </span>
          </div>
        )}

        {installedSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Aplicativo instalado com sucesso na sua tela inicial!</span>
          </div>
        )}

        {/* Step by step info */}
        <div className="mt-4 p-3.5 bg-gray-50 dark:bg-[#251A22] rounded-2xl border border-gray-100 dark:border-[#30212C] space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <p className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#6B1D4B] dark:text-pink-400" />
            <span>Como Rodar no seu Celular:</span>
          </p>
          <ul className="space-y-1 text-[11px] leading-relaxed">
            <li>
              <strong>No Chrome (Android):</strong> Toque no menu (⋮) &gt; <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
            </li>
            <li>
              <strong>No Safari (iPhone):</strong> Toque no ícone Compartilhar <Share2 className="w-3 h-3 inline mx-0.5" /> &gt; <strong>"Adicionar à Tela de Início"</strong>.
            </li>
            <li>
              O ícone oficial de <strong>Vanira e Vanessa</strong> ficará disponível na tela do celular junto aos seus outros aplicativos!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
