import React from 'react';
import { useSalon } from '../context/SalonContext';
import { AppointmentCard } from '../components/AppointmentCard';
import {
  Calendar,
  Plus,
  Clock,
  User,
  ShieldAlert,
  Trash2,
  CalendarPlus,
  Filter,
} from 'lucide-react';

interface ScheduleScreenProps {
  onNewAppointmentClick: () => void;
  onNewBlockClick: () => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  onNewAppointmentClick,
  onNewBlockClick,
}) => {
  const {
    salonName,
    appointments,
    professionals,
    scheduleBlocks,
    deleteScheduleBlock,
    selectedAgendaDate,
    selectAgendaDate,
    selectedProfessionalFilter,
    filterByProfessional,
    updateAppointmentStatus,
    openWhatsApp,
    addToGoogleCalendar,
    deleteAppointment,
  } = useSalon();

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Filtered appointments
  const filteredAppointments = appointments
    .filter((a) => {
      const matchDate = a.dateStr === selectedAgendaDate;
      const matchProf =
        selectedProfessionalFilter === null || a.professionalId === selectedProfessionalFilter;
      return matchDate && matchProf;
    })
    .sort((a, b) => a.timeStr.localeCompare(b.timeStr));

  // Blocks for this day
  const dayBlocks = scheduleBlocks.filter(
    (b) =>
      b.dateStr === selectedAgendaDate &&
      (selectedProfessionalFilter === null || b.professionalId === selectedProfessionalFilter)
  );

  const estimatedDayRevenue = filteredAppointments
    .filter((a) => a.status !== 'CANCELADO')
    .reduce((acc, a) => acc + (Number(a.price) || 0), 0);

  const confirmedCount = filteredAppointments.filter((a) => a.status === 'CONFIRMADO').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Controls */}
      <div className="bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#6B1D4B] dark:text-pink-400" />
              <span>Agenda Diária do Salão</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Controle de horários, bloqueios e agendamentos confirmados
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onNewBlockClick}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Bloquear Horário</span>
            </button>
            <button
              onClick={onNewAppointmentClick}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6B1D4B] dark:bg-[#85275E] hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Agendamento</span>
            </button>
          </div>
        </div>

        {/* Date Selector and Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-[#30212C]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Data:</span>
            <input
              type="date"
              value={selectedAgendaDate}
              onChange={(e) => selectAgendaDate(e.target.value)}
              className="text-xs font-bold rounded-xl border border-gray-300 dark:border-[#422C3D] p-2 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B] bg-white dark:bg-[#251A22] text-gray-900 dark:text-gray-100"
            />
            {/* Quick date shortcuts */}
            <button
              onClick={() => {
                const now = new Date();
                const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                selectAgendaDate(today);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-pink-50 dark:bg-[#2A1B26] text-[#6B1D4B] dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-[#382333] transition"
            >
              Hoje
            </button>
            <button
              onClick={() => {
                const tomorrow = new Date(Date.now() + 86400000);
                const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
                selectAgendaDate(tomorrowStr);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-[#251A22] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2F212C] transition"
            >
              Amanhã
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300 flex-wrap">
            <span>
              Total: <strong className="text-gray-900 dark:text-gray-100">{filteredAppointments.length}</strong>
            </span>
            <span>
              Confirmados: <strong className="text-emerald-700 dark:text-emerald-400">{confirmedCount}</strong>
            </span>
            <span>
              Previsão do dia:{' '}
              <strong className="text-[#6B1D4B] dark:text-pink-400 font-bold">
                {formatBRL(estimatedDayRevenue)}
              </strong>
            </span>
          </div>
        </div>

        {/* Professional Filter Tabs */}
        <div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => filterByProfessional(null)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                selectedProfessionalFilter === null
                  ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white font-bold shadow-xs'
                  : 'bg-gray-100 dark:bg-[#251A22] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2E202B]'
              }`}
            >
              Todos os Profissionais
            </button>
            {professionals.map((prof) => {
              const isSelected = selectedProfessionalFilter === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => filterByProfessional(prof.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white font-bold shadow-xs'
                      : 'bg-gray-100 dark:bg-[#251A22] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2E202B]'
                  }`}
                >
                  <span>{prof.avatarEmoji}</span>
                  <span>{prof.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schedule Blocks (Intervalos / Bloqueios) */}
      {dayBlocks.length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 shadow-xs">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Bloqueios & Intervalos Ativos Hoje ({dayBlocks.length}):</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {dayBlocks.map((block) => {
              const prof = professionals.find((p) => p.id === block.professionalId);
              return (
                <div
                  key={block.id}
                  className="bg-white dark:bg-[#1C141A] p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {block.startTime} - {block.endTime}
                    </span>
                    <p className="text-[11px] text-amber-900 dark:text-amber-300 mt-0.5">
                      {block.reason} ({prof?.name || 'Profissional'})
                    </p>
                  </div>
                  <button
                    onClick={() => deleteScheduleBlock(block.id)}
                    className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition"
                    title="Excluir bloqueio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-2.5">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] rounded-3xl p-12 text-center text-gray-400 dark:text-gray-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">
              Nenhum agendamento encontrado para esta data.
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              Selecione outro dia ou clique no botão abaixo para adicionar um horário.
            </p>
            <button
              onClick={onNewAppointmentClick}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6B1D4B] dark:bg-[#85275E] hover:bg-[#521539] transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Agendamento</span>
            </button>
          </div>
        ) : (
          filteredAppointments.map((app) => (
            <AppointmentCard
              key={app.id}
              appointment={app}
              onStatusChange={updateAppointmentStatus}
              onWhatsAppClick={openWhatsApp}
              onAddToCalendar={addToGoogleCalendar}
              onDeleteClick={deleteAppointment}
              salonName={salonName}
            />
          ))
        )}
      </div>
    </div>
  );
};
