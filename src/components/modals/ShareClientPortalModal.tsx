import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Client } from '../../types';
import { X, Copy, Check, Share2, Send, Download, Globe, Smartphone, ShieldCheck } from 'lucide-react';

interface ShareClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetClient?: Client | null;
}

export const ShareClientPortalModal: React.FC<ShareClientPortalModalProps> = ({
  isOpen,
  onClose,
  targetClient: initialClient,
}) => {
  const {
    clients,
    getClientPortalUrl,
    getClientPortalShareText,
    getDirectApkUrl,
    openWhatsApp,
    generateWebAppHtml,
    salonName,
  } = useSalon();

  const [selectedClient, setSelectedClient] = useState<Client | null>(initialClient || null);
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState(initialClient?.phone || '');

  if (!isOpen) return null;

  const currentUrl = getClientPortalUrl(selectedClient);
  const directApkUrl = getDirectApkUrl ? getDirectApkUrl() : '/portal-cliente.apk';
  const shareText = getClientPortalShareText(selectedClient);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const phone = selectedClient?.phone || customPhone;
    openWhatsApp(phone, shareText);
  };

  const handleDownloadWebAppHtml = () => {
    const html = generateWebAppHtml(selectedClient);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${salonName.toLowerCase().replace(/\s+/g, '_')}_portal.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
              📲
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 leading-tight">
                Enviar Portal do Cliente em APK para WhatsApp
              </h3>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Conectado à mesma base de dados em tempo real</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Target Client Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Personalizar para Cliente (opcional):
            </label>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const id = Number(e.target.value);
                const found = clients.find((c) => c.id === id) || null;
                setSelectedClient(found);
                if (found) setCustomPhone(found.phone);
              }}
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            >
              <option value="">Link Geral do Salão (Qualquer Cliente)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* APK Highlight Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-pink-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Aplicativo Oficial Android (.APK):</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                ~22 MB
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              O link enviado no WhatsApp abre a página de download do APK. Ao instalar, o app no celular do cliente conecta diretamente à mesma base de dados em tempo real.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={directApkUrl}
                download="vanira_e_vanessa_portal_cliente.apk"
                className="py-2 px-3 rounded-xl text-xs font-bold bg-[#6B1D4B] text-white hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar APK Agora</span>
              </a>
              <a
                href="/instalar"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl text-xs font-bold bg-white text-gray-700 hover:text-[#6B1D4B] border border-gray-200 hover:border-[#6B1D4B] transition flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <span>Ver Página de Instalação</span>
              </a>
            </div>
          </div>

          {/* Link Box */}
          <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#6B1D4B] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Link de Download do APK para WhatsApp:</span>
              </span>
              <button
                onClick={handleCopyLink}
                className="text-xs font-bold text-[#6B1D4B] hover:text-[#521539] flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-pink-200 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
            <p className="text-xs font-mono bg-white p-2 rounded-lg border border-pink-100 text-gray-700 break-all select-all">
              {currentUrl}
            </p>
          </div>

          {/* Preview of WhatsApp message */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mensagem Pronta do WhatsApp:
            </label>
            <pre className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-xl whitespace-pre-wrap font-sans text-gray-700 max-h-36 overflow-y-auto">
              {shareText}
            </pre>
          </div>

          {/* Direct Send button */}
          <button
            onClick={handleSendWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-emerald-600 transition flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Link do APK pelo WhatsApp {selectedClient ? `para ${selectedClient.name}` : ''}</span>
          </button>

          {/* Standalone HTML Web App Export */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800">Versão Web App (.html)</h4>
              <p className="text-[11px] text-gray-500">
                Opção leve que funciona direto no navegador sem instalar
              </p>
            </div>
            <button
              onClick={handleDownloadWebAppHtml}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .html</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
