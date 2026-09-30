import React from 'react';
import { Appointment, AppointmentStatus } from '../types';
import {
  Calendar,
  Clock,
  User,
  MessageCircle,
  CalendarPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange: (id: number, status: AppointmentStatus) => void;
  onWhatsAppClick: (phone: string, message: string) => void;
  onAddToCalendar: (appointment: Appointment) => void;
  onDeleteClick?: (id: number) => void;
  salonName?: string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onStatusChange,
  onWhatsAppClick,
  onAddToCalendar,
  onDeleteClick,
  salonName = 'Vanira e Vanessa Salão Especializado',
}) => {
  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Confirmado
          </span>
        );
      case 'AGUARDANDO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Aguardando
          </span>
        );
      case 'CONCLUIDO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Concluído
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 dark:bg-[#251A22] text-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const handleWhatsAppConfirm = () => {
    const msg = `Olá, ${appointment.clientName}! 💇‍♀️✨
Passando para confirmar seu horário no *${salonName}*:

📅 Data: *${appointment.dateStr}* às *${appointment.timeStr}*
✂️ Serviço: *${appointment.serviceName}*
👤 Especialista: *${appointment.professionalName}*
💰 Valor: *${formatBRL(appointment.price)}*

Tudo certo para o seu atendimento? Te esperamos com muito carinho! 💕`;
    onWhatsAppClick(appointment.clientPhone, msg);
  };

  return (
    <div className="bg-white dark:bg-[#1C141A] rounded-2xl border border-pink-100 dark:border-[#382633] shadow-xs hover:shadow-md transition p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Time & Service Info */}
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="w-14 h-14 rounded-xl bg-pink-50 dark:bg-[#281824] border border-pink-100 dark:border-[#42293C] flex flex-col items-center justify-center text-[#6B1D4B] dark:text-pink-300 shrink-0">
          <Clock className="w-4 h-4 mb-0.5" />
          <span className="text-sm font-extrabold leading-none">{appointment.timeStr}</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">{appointment.durationMinutes}m</span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 truncate">
              {appointment.clientName}
            </h4>
            {getStatusBadge(appointment.status)}
          </div>

          <p className="text-xs font-semibold text-[#6B1D4B] dark:text-pink-300 flex items-center gap-1.5">
            <span>✂️ {appointment.serviceName}</span>
            <span className="text-gray-300 dark:text-gray-600">&bull;</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">com {appointment.professionalName}</span>
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatBRL(appointment.price)}</span>
            <span>&bull;</span>
            <span>📱 {appointment.clientPhone}</span>
            {appointment.notes && (
              <>
                <span>&bull;</span>
                <span className="text-gray-400 dark:text-gray-500 truncate max-w-xs" title={appointment.notes}>
                  {appointment.notes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {/* Status Dropdown */}
        <select
          value={appointment.status}
          onChange={(e) => onStatusChange(appointment.id, e.target.value as AppointmentStatus)}
          className="text-xs font-semibold bg-gray-50 dark:bg-[#251A22] border border-gray-200 dark:border-[#3E293A] rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2D1F2A] focus:outline-hidden focus:ring-1 focus:ring-[#6B1D4B]"
        >
          <option value="CONFIRMADO">Confirmado</option>
          <option value="AGUARDANDO">Aguardando</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="CANCELADO">Cancelado</option>
        </select>

        {/* WhatsApp Direct */}
        <button
          onClick={handleWhatsAppConfirm}
          className="p-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition"
          title="Enviar confirmação pelo WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Google Calendar */}
        <button
          onClick={() => onAddToCalendar(appointment)}
          className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition"
          title="Adicionar ao Google Agenda"
        >
          <CalendarPlus className="w-4 h-4" />
        </button>

        {/* Delete */}
        {onDeleteClick && (
          <button
            onClick={() => onDeleteClick(appointment.id)}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
            title="Remover agendamento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
