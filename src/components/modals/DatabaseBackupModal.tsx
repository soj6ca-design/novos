import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { X, Download, Upload, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface DatabaseBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseBackupModal: React.FC<DatabaseBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createLocalBackup, restoreFromBackupJson, salonName } = useSalon();

  const [jsonInput, setJsonInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = createLocalBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${salonName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ type: 'success', text: 'Backup exportado com sucesso!' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonInput(content);
        const res = restoreFromBackupJson(content);
        if (res.success) {
          setStatusMessage({ type: 'success', text: res.message });
        } else {
          setStatusMessage({ type: 'error', text: res.message });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleManualRestore = () => {
    if (!jsonInput.trim()) return;
    const res = restoreFromBackupJson(jsonInput);
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💾</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
                Backup & Restauração de Dados
              </h3>
              <p className="text-xs text-gray-500">
                Segurança local completa em formato JSON
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Export Box */}
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
            <h4 className="text-sm font-bold text-purple-950 mb-1 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-purple-700" />
              <span>Exportar Backup Agora</span>
            </h4>
            <p className="text-xs text-purple-800 mb-3">
              Gera um arquivo .json seguro com todos os clientes, agendamentos, estoque e faturamento do salão.
            </p>
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] transition shadow-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo JSON de Backup</span>
            </button>
          </div>

          {/* Import Box */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-gray-700" />
              <span>Restaurar a partir de Backup</span>
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              Selecione o arquivo de backup exportado anteriormente ou cole o conteúdo JSON abaixo:
            </p>

            <label className="block mb-2">
              <span className="sr-only">Escolher arquivo de backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6B1D4B] file:text-white hover:file:bg-[#521539] cursor-pointer"
              />
            </label>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Ou cole o JSON do backup aqui..."
              rows={4}
              className="w-full text-xs font-mono rounded-xl border border-gray-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B] bg-white mt-2"
            />

            {jsonInput.trim() && (
              <button
                onClick={handleManualRestore}
                className="mt-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                Aplicar Restauração do Texto Acima
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
