import React from 'react';
import { useSalon } from '../context/SalonContext';
import { AppointmentCard } from '../components/AppointmentCard';
import { QuickActionsGrid } from '../components/QuickActionsGrid';
import { AdminTab, Appointment } from '../types';
import {
  TrendingUp,
  DollarSign,
  Share2,
  Database,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface DashboardScreenProps {
  onNewAppointmentClick: () => void;
  onSharePortalClick: () => void;
  onBackupClick: () => void;
  onResetClick: () => void;
  onNewClientClick: () => void;
  onNewServiceClick: () => void;
  onNewProfessionalClick: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNewAppointmentClick,
  onSharePortalClick,
  onBackupClick,
  onResetClick,
  onNewClientClick,
  onNewServiceClick,
  onNewProfessionalClick,
}) => {
  const {
    salonName,
    appointments,
    transactions,
    selectAdminTab,
    updateAppointmentStatus,
    openWhatsApp,
    addToGoogleCalendar,
    deleteAppointment,
    selectedAgendaDate,
  } = useSalon();

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Today's appointments
  const todayAppointments = appointments
    .filter((a) => a.dateStr === selectedAgendaDate)
    .sort((a, b) => a.timeStr.localeCompare(b.timeStr));

  const totalToday = todayAppointments.length;
  const confirmedCount = todayAppointments.filter((a) => a.status === 'CONFIRMADO').length;
  const pendingCount = todayAppointments.filter((a) => a.status === 'AGUARDANDO').length;
  const canceledCount = todayAppointments.filter((a) => a.status === 'CANCELADO').length;

  // Financial Metrics
  const todayRevenue = transactions
    .filter((t) => t.status === 'PAGO' && t.dateStr === selectedAgendaDate)
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const monthRevenue = transactions
    .filter((t) => t.status === 'PAGO')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const pendingReceivable = transactions
    .filter((t) => t.status === 'PENDENTE')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-5 pb-10">
      {/* Hero Visual Banner */}
      <div className="relative w-full h-36 sm:h-44 rounded-3xl overflow-hidden shadow-sm border border-pink-100 bg-[#3D0026]">
        <img
          src="/images/salon_hero_banner.jpg"
          alt={salonName}
          className="w-full h-full object-cover object-center opacity-70"
          onError={(e) => {
            // fallback if image not loaded
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A081D] via-[#2A081D]/60 to-transparent flex flex-col justify-end p-5 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">💇‍♀️</span>
            <h2 className="text-xl sm:text-2xl font-black">{salonName}</h2>
          </div>
          <p className="text-xs sm:text-sm text-pink-100/90 font-medium">
            Painel de Controle &bull; Visão Geral em Tempo Real
          </p>
        </div>
      </div>

      {/* WhatsApp Client Portal Invitation Card */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
            <span>📲 Portal do Salão em APK via WhatsApp</span>
          </h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-0.5 max-w-xl">
            Envie o link contendo o portal em APK para instalar no celular da cliente. Conecta à mesma base de dados em tempo real do salão!
          </p>
        </div>
        <button
          onClick={onSharePortalClick}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-emerald-600 transition shadow-xs shrink-0 flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Enviar APK no WhatsApp</span>
        </button>
      </div>

      {/* Hoje Badges Section */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2.5 flex items-center gap-1.5">
          <span>Hoje</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({selectedAgendaDate})</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <span className="text-2xl">🟣</span>
            <div>
              <p className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                {String(totalToday).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">atendimentos</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C141A] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <span className="text-2xl">🟢</span>
            <div>
              <p className="text-base font-extrabold text-emerald-800 dark:text-emerald-300">
                {String(confirmedCount).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">confirmados</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C141A] border border-amber-100 dark:border-amber-900/50 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <span className="text-2xl">🟠</span>
            <div>
              <p className="text-base font-extrabold text-amber-800 dark:text-amber-300">
                {String(pendingCount).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">aguardando</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C141A] border border-rose-100 dark:border-rose-900/50 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="text-base font-extrabold text-rose-800 dark:text-rose-300">
                {String(canceledCount).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">cancelamento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Key Metrics Row */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2.5">Faturamento & Caixa</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-[#2A1826] dark:to-[#1C141A] border border-purple-100 dark:border-[#4A263E] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-purple-900 dark:text-pink-300 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Faturamento Mês</span>
              <TrendingUp className="w-4 h-4 text-purple-700 dark:text-pink-400" />
            </div>
            <p className="text-2xl font-black text-[#6B1D4B] dark:text-pink-300">{formatBRL(monthRevenue)}</p>
            <p className="text-xs text-purple-700 dark:text-pink-400/90 mt-1 font-semibold">
              Hoje: {formatBRL(todayRevenue)}
            </p>
          </div>

          <div className="bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Contas a Receber</span>
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{formatBRL(pendingReceivable)}</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-semibold">
              Pagamentos pendentes de confirmação
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2.5">Ações Rápidas</h3>
        <QuickActionsGrid
          onNewAppointmentClick={onNewAppointmentClick}
          onTabSelect={selectAdminTab}
          onNewClientClick={onNewClientClick}
          onNewServiceClick={onNewServiceClick}
          onNewProfessionalClick={onNewProfessionalClick}
        />
      </div>

      {/* Database Backup & Reset Box */}
      <div className="bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗄️</span>
          <div>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100">Base de Dados Local & Segurança</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Faça backup geral em JSON ou limpe registros de testes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackupClick}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 transition flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>💾 Backup Geral</span>
          </button>
          <button
            onClick={onResetClick}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>🧹 Limpar Base</span>
          </button>
        </div>
      </div>

      {/* Próximos Horários de Hoje */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
            <span>Próximos Horários de Hoje</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-[#3D1E33] text-[#6B1D4B] dark:text-pink-300">
              {todayAppointments.length}
            </span>
          </h3>
          <button
            onClick={() => selectAdminTab('AGENDA')}
            className="text-xs font-bold text-[#6B1D4B] dark:text-pink-400 hover:underline flex items-center gap-1"
          >
            <span>Ver Agenda Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="bg-white dark:bg-[#1C141A] border border-pink-100 dark:border-[#382633] rounded-2xl p-8 text-center text-gray-400 dark:text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Nenhum agendamento para hoje ainda.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Toque em '+ Agendamento' acima para marcar.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayAppointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onStatusChange={updateAppointmentStatus}
                onWhatsAppClick={openWhatsApp}
                onAddToCalendar={addToGoogleCalendar}
                onDeleteClick={deleteAppointment}
                salonName={salonName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
