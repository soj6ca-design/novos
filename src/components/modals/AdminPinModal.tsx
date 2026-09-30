import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { X, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUnlock?: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccessUnlock,
}) => {
  const { verifyAdminPin, exitClientOnlyMode, adminPin, setAdminPin } = useSalon();

  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);
  const [changePinMode, setChangePinMode] = useState(false);
  const [newPin, setNewPin] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pinInput)) {
      exitClientOnlyMode();
      setError(false);
      onSuccessUnlock?.();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pinInput) && newPin.trim().length >= 4) {
      setAdminPin(newPin.trim());
      setChangePinMode(false);
      alert('PIN administrativo atualizado com sucesso!');
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <h3 className="font-extrabold text-lg text-gray-900">
              {changePinMode ? 'Alterar PIN de Segurança' : 'Desbloquear Acesso Admin'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>PIN incorreto. (Padrão: 1234)</span>
          </div>
        )}

        {!changePinMode ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            <p className="text-xs text-gray-500">
              Digite seu PIN de 4 dígitos para sair do modo restrito do cliente e retornar ao painel do salão:
            </p>

            <div>
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setError(false);
                }}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-widest font-mono rounded-xl border border-gray-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] transition shadow-sm text-sm"
            >
              Desbloquear Painel
            </button>

            <button
              type="button"
              onClick={() => setChangePinMode(true)}
              className="w-full text-xs text-gray-500 hover:text-[#6B1D4B] text-center"
            >
              Deseja alterar seu PIN?
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">PIN Atual:</label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN Atual (1234)"
                className="w-full text-sm rounded-xl border border-gray-300 p-2.5"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Novo PIN (min 4 dígitos):</label>
              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Novo PIN"
                className="w-full text-sm rounded-xl border border-gray-300 p-2.5"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setChangePinMode(false)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-white bg-[#6B1D4B] rounded-xl"
              >
                Salvar PIN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
