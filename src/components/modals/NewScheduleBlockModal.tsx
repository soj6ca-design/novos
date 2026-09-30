import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { X, Clock, Calendar } from 'lucide-react';

interface NewScheduleBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export const NewScheduleBlockModal: React.FC<NewScheduleBlockModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
}) => {
  const { professionals, selectedAgendaDate, addScheduleBlock } = useSalon();

  const [professionalId, setProfessionalId] = useState<number>(professionals[0]?.id || 1);
  const [dateStr, setDateStr] = useState(defaultDate || selectedAgendaDate);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:00');
  const [reason, setReason] = useState('Intervalo de Almoço');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    addScheduleBlock(
      Number(professionalId),
      dateStr,
      startTime,
      endTime,
      reason.trim()
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚫</span>
            <h3 className="font-extrabold text-lg text-gray-900">Bloquear Horário na Agenda</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Profissional:</label>
            <select
              value={professionalId}
              onChange={(e) => setProfessionalId(Number(e.target.value))}
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            >
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.avatarEmoji} {p.name} ({p.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Data:</label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Início (HH:mm):</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Término (HH:mm):</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Motivo do Bloqueio:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Almoço, Curso de Aperfeiçoamento, Consulta médica..."
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#53163a] rounded-xl transition shadow-sm"
            >
              Criar Bloqueio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
