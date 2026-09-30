import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { X, AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    clearAppointmentsAndFinancial,
    resetDatabaseBlank,
    restoreDatabaseDefaults,
  } = useSalon();

  const [resetName, setResetName] = useState(false);
  const [doneMsg, setDoneMsg] = useState('');

  if (!isOpen) return null;

  const handleClearAppointments = () => {
    clearAppointmentsAndFinancial();
    setDoneMsg('Atendimentos e financeiro limpos com sucesso!');
    setTimeout(() => {
      setDoneMsg('');
      onClose();
    }, 1200);
  };

  const handleResetBlank = () => {
    resetDatabaseBlank(resetName);
    setDoneMsg('Toda a base foi limpa em branco com sucesso!');
    setTimeout(() => {
      setDoneMsg('');
      onClose();
    }, 1200);
  };

  const handleRestoreDefaults = () => {
    restoreDatabaseDefaults(resetName);
    setDoneMsg('Dados padrão do salão restaurados com sucesso!');
    setTimeout(() => {
      setDoneMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧹</span>
            <h3 className="font-extrabold text-lg text-gray-900">Gerenciar Dados & Limpeza</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {doneMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-center font-bold text-sm">
            {doneMsg}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Escolha a ação desejada para manutenção do sistema:
            </p>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 p-2 rounded-xl bg-gray-50 border border-gray-200">
              <input
                type="checkbox"
                checked={resetName}
                onChange={(e) => setResetName(e.target.checked)}
                className="rounded text-[#6B1D4B] focus:ring-[#6B1D4B]"
              />
              <span>Restaurar também o nome do salão para o padrão</span>
            </label>

            {/* Action 1 */}
            <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50">
              <h4 className="text-xs font-bold text-amber-900 mb-1">
                1. Limpar Somente Agenda e Caixa
              </h4>
              <p className="text-[11px] text-amber-800 mb-2.5">
                Remove atendimentos e transações financeiras de teste, mantendo seus clientes, serviços e equipe cadastrados.
              </p>
              <button
                onClick={handleClearAppointments}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition shadow-2xs"
              >
                Limpar Agendamentos e Caixa
              </button>
            </div>

            {/* Action 2 */}
            <div className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/50">
              <h4 className="text-xs font-bold text-purple-900 mb-1">
                2. Restaurar Dados de Demonstração
              </h4>
              <p className="text-[11px] text-purple-800 mb-2.5">
                Restaura todos os serviços, equipe Vanira e Vanessa, produtos e atendimentos iniciais completos.
              </p>
              <button
                onClick={handleRestoreDefaults}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-[#6B1D4B] hover:bg-[#521539] text-white transition shadow-2xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Dados Padrão</span>
              </button>
            </div>

            {/* Action 3 */}
            <div className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/50">
              <h4 className="text-xs font-bold text-rose-900 mb-1">
                3. Limpar Tudo em Branco (Zero)
              </h4>
              <p className="text-[11px] text-rose-800 mb-2.5">
                Apaga todos os dados para que você cadastre seu próprio salão do zero absoluto.
              </p>
              <button
                onClick={handleResetBlank}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Toda a Base em Branco</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
