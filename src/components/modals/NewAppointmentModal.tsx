import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { X, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDate,
}) => {
  const {
    services,
    professionals,
    clients,
    selectedAgendaDate,
    addAppointment,
    getOccupiedTimes,
  } = useSalon();

  const [clientMode, setClientMode] = useState<'existing' | 'new'>('existing');
  const [selectedClientId, setSelectedClientId] = useState<number | ''>(clients[0]?.id || '');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const [selectedServiceId, setSelectedServiceId] = useState<number>(services[0]?.id || 1);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number>(professionals[0]?.id || 1);
  const [dateStr, setDateStr] = useState(preselectedDate || selectedAgendaDate);
  const [timeStr, setTimeStr] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [conflictWarning, setConflictWarning] = useState(false);

  if (!isOpen) return null;

  const times = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const occupiedTimes = getOccupiedTimes(selectedProfessionalId, dateStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let clientName = '';
    let clientPhone = '';
    let cId: number | null = null;

    if (clientMode === 'existing') {
      const found = clients.find((c) => c.id === Number(selectedClientId));
      if (!found) return;
      clientName = found.name;
      clientPhone = found.phone;
      cId = found.id;
    } else {
      if (!newClientName.trim() || !newClientPhone.trim()) return;
      clientName = newClientName.trim();
      clientPhone = newClientPhone.trim();
    }

    const service = services.find((s) => s.id === Number(selectedServiceId));
    const professional = professionals.find((p) => p.id === Number(selectedProfessionalId));
    if (!service || !professional) return;

    const success = addAppointment(
      clientName,
      clientPhone,
      cId,
      service,
      professional,
      dateStr,
      timeStr,
      notes,
      () => setConflictWarning(true),
      () => {
        setConflictWarning(false);
        onClose();
      }
    );

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗓️</span>
            <h3 className="font-extrabold text-lg text-gray-900">Novo Agendamento</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {conflictWarning && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Este horário já está ocupado ou bloqueado para este profissional. Selecione outro horário livre.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Cliente:</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setClientMode('existing')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                  clientMode === 'existing'
                    ? 'bg-[#6B1D4B] text-white border-[#6B1D4B]'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Cadastrado
              </button>
              <button
                type="button"
                onClick={() => setClientMode('new')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                  clientMode === 'new'
                    ? 'bg-[#6B1D4B] text-white border-[#6B1D4B]'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                + Novo Cliente
              </button>
            </div>

            {clientMode === 'existing' ? (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(Number(e.target.value))}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                required
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nome do Cliente"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp (com DDD)"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                  required
                />
              </div>
            )}
          </div>

          {/* Service & Professional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Serviço:</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - R$ {s.price.toFixed(2)} ({s.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Profissional:</label>
              <select
                value={selectedProfessionalId}
                onChange={(e) => setSelectedProfessionalId(Number(e.target.value))}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.avatarEmoji} {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
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

          {/* Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">Horário Disponível:</label>
              <span className="text-[11px] text-gray-500">
                Vermelho = ocupado / bloqueado
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {times.map((t) => {
                const isOccupied = occupiedTimes.has(t);
                const isSelected = timeStr === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => setTimeStr(t)}
                    className={`py-2 px-1 text-xs rounded-lg font-bold border transition text-center ${
                      isOccupied
                        ? 'bg-rose-50 text-rose-400 border-rose-100 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-[#6B1D4B] text-white border-[#6B1D4B] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#6B1D4B]'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Observações:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Alérgica a amônia, prefere café com canela..."
              rows={2}
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#53163a] rounded-xl transition shadow-sm"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
