import React from 'react';
import { AdminTab } from '../types';
import {
  CalendarPlus,
  Calendar,
  Users,
  DollarSign,
  Package,
  Bot,
  UserPlus,
  Scissors,
  UserCheck,
} from 'lucide-react';

interface QuickActionsGridProps {
  onNewAppointmentClick: () => void;
  onTabSelect: (tab: AdminTab) => void;
  onNewClientClick?: () => void;
  onNewServiceClick?: () => void;
  onNewProfessionalClick?: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onNewAppointmentClick,
  onTabSelect,
  onNewClientClick,
  onNewServiceClick,
  onNewProfessionalClick,
}) => {
  return (
    <div className="space-y-3">
      {/* Primary Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        <button
          onClick={onNewAppointmentClick}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-[#6B1D4B] to-[#9E5471] dark:from-[#85275E] dark:to-[#6B1D4B] text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition group text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2 group-hover:bg-white/30 transition">
            <CalendarPlus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold leading-tight">+ Agendamento</span>
          <span className="text-[10px] text-pink-200 mt-0.5">Novo Horário</span>
        </button>

        <button
          onClick={() => onTabSelect('AGENDA')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] shadow-xs hover:border-[#6B1D4B]/30 hover:bg-pink-50/50 dark:hover:bg-[#261A23] hover:scale-[1.02] active:scale-[0.98] transition text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-[#6B1D4B] dark:text-pink-300 flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">Agenda</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Visão do Dia</span>
        </button>

        <button
          onClick={() => onTabSelect('CLIENTES')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] shadow-xs hover:border-[#6B1D4B]/30 hover:bg-pink-50/50 dark:hover:bg-[#261A23] hover:scale-[1.02] active:scale-[0.98] transition text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">Clientes</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Base e Histórico</span>
        </button>

        <button
          onClick={() => onTabSelect('FINANCEIRO')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] shadow-xs hover:border-[#6B1D4B]/30 hover:bg-pink-50/50 dark:hover:bg-[#261A23] hover:scale-[1.02] active:scale-[0.98] transition text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">Financeiro</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Caixa & Receber</span>
        </button>

        <button
          onClick={() => onTabSelect('ESTOQUE')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] shadow-xs hover:border-[#6B1D4B]/30 hover:bg-pink-50/50 dark:hover:bg-[#261A23] hover:scale-[1.02] active:scale-[0.98] transition text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">Estoque</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Produtos & Alerta</span>
        </button>

        <button
          onClick={() => onTabSelect('IA_ASSISTENTE')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] shadow-xs hover:border-[#6B1D4B]/30 hover:bg-pink-50/50 dark:hover:bg-[#261A23] hover:scale-[1.02] active:scale-[0.98] transition text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-[#3B1F32] text-[#6B1D4B] dark:text-pink-300 flex items-center justify-center mb-2">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">IA Assistente</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Consultoria 24h</span>
        </button>
      </div>

      {/* Quick Add Buttons Sub-Bar */}
      {(onNewClientClick || onNewServiceClick || onNewProfessionalClick) && (
        <div className="bg-pink-50/60 dark:bg-[#1C141A] rounded-xl p-2.5 border border-pink-100 dark:border-[#382633] flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-[#6B1D4B] dark:text-pink-300 flex items-center gap-1">
            <span>⚡ Cadastros Rápidos:</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {onNewClientClick && (
              <button
                onClick={onNewClientClick}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#261A23] text-gray-700 dark:text-gray-200 hover:text-[#6B1D4B] dark:hover:text-pink-300 border border-pink-200 dark:border-[#422B3D] transition shadow-2xs flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3 text-[#6B1D4B] dark:text-pink-400" />
                <span>+ Cliente</span>
              </button>
            )}
            {onNewServiceClick && (
              <button
                onClick={onNewServiceClick}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#261A23] text-gray-700 dark:text-gray-200 hover:text-[#6B1D4B] dark:hover:text-pink-300 border border-pink-200 dark:border-[#422B3D] transition shadow-2xs flex items-center gap-1"
              >
                <Scissors className="w-3 h-3 text-[#6B1D4B] dark:text-pink-400" />
                <span>+ Serviço</span>
              </button>
            )}
            {onNewProfessionalClick && (
              <button
                onClick={onNewProfessionalClick}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#261A23] text-gray-700 dark:text-gray-200 hover:text-[#6B1D4B] dark:hover:text-pink-300 border border-pink-200 dark:border-[#422B3D] transition shadow-2xs flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-[#6B1D4B] dark:text-pink-400" />
                <span>+ Profissional</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
