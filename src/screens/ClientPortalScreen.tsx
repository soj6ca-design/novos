import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  SalonService,
  Professional,
  Appointment,
  Client,
  ClientPortalTab,
} from '../types';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Search,
  Share2,
  Send,
  CalendarPlus,
  Download,
  RefreshCw,
  XCircle,
  MessageCircle,
  ExternalLink,
  Bot,
  HelpCircle,
} from 'lucide-react';

interface ClientPortalScreenProps {
  onOpenShareModal?: () => void;
}

export const ClientPortalScreen: React.FC<ClientPortalScreenProps> = ({
  onOpenShareModal,
}) => {
  const {
    salonName,
    services,
    professionals,
    appointments,
    clients,
    activeClientForPortal,
    getOccupiedTimes,
    addAppointment,
    cancelAppointmentByClient,
    rescheduleAppointment,
    addToGoogleCalendar,
    openWhatsApp,
    updateClient,
    getClientPortalUrl,
    getClientPortalShareText,
    selectedAgendaDate,
  } = useSalon();

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const [currentTab, setCurrentTab] = useState<ClientPortalTab>('AGENDAR');

  // Booking Flow Steps: 1: Serviço, 2: Profissional, 3: Data & Horário, 4: Seus Dados, 5: Sucesso
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<SalonService | null>(services[0] || null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(professionals[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>(selectedAgendaDate);
  const [selectedTime, setSelectedTime] = useState<string>('10:00');

  const [clientName, setClientName] = useState<string>(activeClientForPortal?.name || '');
  const [clientPhone, setClientPhone] = useState<string>(activeClientForPortal?.phone || '');
  const [clientNotes, setClientNotes] = useState<string>(activeClientForPortal?.hairPreferences || '');

  const [conflictAlert, setConflictAlert] = useState<boolean>(false);
  const [confirmedApp, setConfirmedApp] = useState<Appointment | null>(null);

  // Service filter in step 1
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Meus Agendamentos filter
  const [lookupPhone, setLookupPhone] = useState<string>(activeClientForPortal?.phone || '');

  // Enviar Web App tab state
  const [shareSearch, setShareSearch] = useState<string>('');
  const [selectedShareClient, setSelectedShareClient] = useState<Client | null>(activeClientForPortal || null);
  const [customSharePhone, setCustomSharePhone] = useState<string>(activeClientForPortal?.phone || '');
  const [customShareName, setCustomShareName] = useState<string>(activeClientForPortal?.name || '');

  // Reagendamento modal state
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [reschedDate, setReschedDate] = useState<string>(selectedAgendaDate);
  const [reschedTime, setReschedTime] = useState<string>('14:00');

  // IA Q&A for client portal
  const [clientAiQuery, setClientAiQuery] = useState('');
  const [clientAiAnswer, setClientAiAnswer] = useState('');
  const [clientAiLoading, setClientAiLoading] = useState(false);

  const categories = useMemo(() => {
    return ['Todos', ...Array.from(new Set(services.map((s) => s.category))).sort()];
  }, [services]);

  const displayedServices = useMemo(() => {
    return services.filter((s) => {
      const matchCat = selectedCategory === 'Todos' || s.category === selectedCategory;
      const matchSearch =
        !serviceSearch.trim() ||
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(serviceSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, selectedCategory, serviceSearch]);

  const times = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const occupiedTimes = useMemo(() => {
    if (!selectedProfessional) return new Set<string>();
    return getOccupiedTimes(selectedProfessional.id, selectedDate);
  }, [selectedProfessional, selectedDate, appointments, getOccupiedTimes]);

  // Client's appointments
  const myAppointments = useMemo(() => {
    if (!lookupPhone.trim()) {
      return appointments.slice(0, 10);
    }
    const cleanLookup = lookupPhone.replace(/\D/g, '');
    return appointments.filter((a) => {
      const cleanA = a.clientPhone.replace(/\D/g, '');
      return (
        cleanA.includes(cleanLookup) ||
        cleanLookup.includes(cleanA) ||
        a.clientName.toLowerCase().includes(lookupPhone.toLowerCase())
      );
    });
  }, [appointments, lookupPhone]);

  const handleBookingSubmit = () => {
    if (!selectedService || !selectedProfessional) return;
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor, informe seu nome e WhatsApp.');
      return;
    }

    const success = addAppointment(
      clientName.trim(),
      clientPhone.trim(),
      activeClientForPortal?.id || null,
      selectedService,
      selectedProfessional,
      selectedDate,
      selectedTime,
      clientNotes.trim(),
      () => setConflictAlert(true),
      (newId) => {
        setConflictAlert(false);
        const newApp: Appointment = {
          id: newId,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          clientId: activeClientForPortal?.id || null,
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          professionalId: selectedProfessional.id,
          professionalName: selectedProfessional.name,
          dateStr: selectedDate,
          timeStr: selectedTime,
          durationMinutes: selectedService.durationMinutes,
          price: selectedService.price,
          status: 'CONFIRMADO',
          notes: clientNotes.trim(),
          createdAt: Date.now(),
        };
        setConfirmedApp(newApp);
        setBookingStep(5);
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }
    );

    if (!success) {
      setConflictAlert(true);
    }
  };

  const handleClientAiAsk = async (queryText: string) => {
    const q = queryText || clientAiQuery;
    if (!q.trim()) return;

    setClientAiLoading(true);
    setClientAiAnswer('');
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Pergunta da cliente sobre serviços de beleza: "${q}". Responda de forma acolhedora, explicando procedimentos do salão ${salonName}.`,
          services,
          salonName,
        }),
      });
      const data = await res.json();
      setClientAiAnswer(data.text || 'Consulte nossas especialistas no salão!');
    } catch {
      setClientAiAnswer(
        'Nossas especialistas recomendam um teste de mecha antes de qualquer clareamento para garantir a integridade dos fios. Agende uma avaliação!'
      );
    } finally {
      setClientAiLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-16">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-[#6B1D4B] via-[#85275E] to-[#9E5471] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div>
            <h2 className="text-xl font-black">{salonName}</h2>
            <p className="text-xs text-pink-100 opacity-90 mt-0.5">
              {activeClientForPortal
                ? `Olá, ${activeClientForPortal.name}! • Portal Individual`
                : 'Portal do Cliente • Agendamento em Tempo Real'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-700/80 text-white border border-emerald-500/50 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Ao Vivo</span>
          </span>
        </div>

        {onOpenShareModal && (
          <button
            onClick={onOpenShareModal}
            className="mt-3 w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 transition shadow-xs flex items-center justify-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enviar Link do Portal via WhatsApp para Celular</span>
          </button>
        )}
      </div>

      {/* Portal Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-white dark:bg-[#1C141A] p-1.5 rounded-2xl border border-pink-100 dark:border-[#382633] shadow-xs text-xs font-bold transition-colors">
        <button
          onClick={() => setCurrentTab('AGENDAR')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            currentTab === 'AGENDAR'
              ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-[#281A24]'
          }`}
        >
          <span>🗓️ Agendar</span>
        </button>
        <button
          onClick={() => setCurrentTab('MEUS_AGENDAMENTOS')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            currentTab === 'MEUS_AGENDAMENTOS'
              ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-[#281A24]'
          }`}
        >
          <span>📋 Meus Horários</span>
        </button>
        <button
          onClick={() => setCurrentTab('ENVIAR_APK')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            currentTab === 'ENVIAR_APK' || currentTab === 'ENVIAR_WEB_APP'
              ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-[#281A24]'
          }`}
        >
          <span>📲 Instalar / Enviar APK</span>
        </button>
        <button
          onClick={() => setCurrentTab('CONSULTORA_IA')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            currentTab === 'CONSULTORA_IA'
              ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-[#281A24]'
          }`}
        >
          <span>✨ Dúvidas & IA</span>
        </button>
        <button
          onClick={() => setCurrentTab('MEUS_DADOS')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            currentTab === 'MEUS_DADOS'
              ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-[#281A24]'
          }`}
        >
          <span>👤 Meu Perfil</span>
        </button>
      </div>

      {/* Tab 1: AGENDAR */}
      {currentTab === 'AGENDAR' && (
        <div className="bg-white dark:bg-[#1C141A] rounded-3xl border border-pink-100 dark:border-[#382633] p-5 shadow-xs space-y-4">
          {/* Progress Indicator */}
          {bookingStep < 5 && (
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold border-b border-gray-100 dark:border-[#30212C] pb-3">
              {[
                { s: 1, title: 'Serviço' },
                { s: 2, title: 'Especialista' },
                { s: 3, title: 'Data/Hora' },
                { s: 4, title: 'Confirmar' },
              ].map(({ s, title }) => (
                <div
                  key={s}
                  className={`p-1.5 rounded-xl transition ${
                    bookingStep === s
                      ? 'bg-pink-100 dark:bg-[#3D1E33] text-[#6B1D4B] dark:text-pink-300'
                      : bookingStep > s
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <span className="text-[10px] block opacity-70">Passo {s}</span>
                  <span>{title}</span>
                </div>
              ))}
            </div>
          )}

          {conflictAlert && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Horário indisponível! Este horário já foi reservado ou bloqueado. Escolha outro horário em verde.
              </span>
            </div>
          )}

          {/* Step 1: Serviços */}
          {bookingStep === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                  1. Serviços Cadastrados ({services.length}):
                </h3>
                <span className="text-xs text-[#6B1D4B] dark:text-pink-300 font-semibold">Valores atualizados</span>
              </div>

              {/* Search & Category Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar serviço por nome..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-[#422C3D] bg-white dark:bg-[#251A22] text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                        selectedCategory === cat
                          ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white'
                          : 'bg-gray-100 dark:bg-[#251A22] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#30202D]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Cards */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {displayedServices.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#6B1D4B] dark:border-[#85275E] bg-pink-50/50 dark:bg-[#2C1927] shadow-xs ring-1 ring-[#6B1D4B] dark:ring-[#85275E]'
                          : 'border-gray-200 dark:border-[#382633] hover:border-pink-200 dark:hover:border-[#6B1D4B] bg-white dark:bg-[#20151E]'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">{service.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#2A1D27] font-semibold text-gray-700 dark:text-gray-300">
                            {service.category}
                          </span>
                          <span>&bull;</span>
                          <span>{service.durationMinutes} min</span>
                        </div>
                        {service.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-black text-[#6B1D4B] dark:text-pink-300 shrink-0">
                        {formatBRL(service.price)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                disabled={!selectedService}
                onClick={() => setBookingStep(2)}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#6B1D4B] dark:bg-[#85275E] hover:bg-[#521539] transition disabled:opacity-50 text-xs shadow-sm"
              >
                Continuar para Profissional
              </button>
            </div>
          )}

          {/* Step 2: Escolha de Especialista */}
          {bookingStep === 2 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                2. Escolha sua Especialista no Salão:
              </h3>

              <div className="space-y-2">
                {professionals.map((prof) => {
                  const isSelected = selectedProfessional?.id === prof.id;
                  return (
                    <div
                      key={prof.id}
                      onClick={() => setSelectedProfessional(prof)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#6B1D4B] dark:border-[#85275E] bg-pink-50/50 dark:bg-[#2C1927] shadow-xs ring-1 ring-[#6B1D4B] dark:ring-[#85275E]'
                          : 'border-gray-200 dark:border-[#382633] hover:border-pink-200 dark:hover:border-[#6B1D4B] bg-white dark:bg-[#20151E]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-pink-100 dark:bg-[#3B1E32] flex items-center justify-center text-xl shrink-0">
                          {prof.avatarEmoji}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">{prof.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{prof.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                        ★ {prof.rating}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setBookingStep(1)}
                  className="flex-1 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#251A22] rounded-xl"
                >
                  Voltar
                </button>
                <button
                  disabled={!selectedProfessional}
                  onClick={() => setBookingStep(3)}
                  className="flex-2 py-2.5 text-xs font-bold text-white bg-[#6B1D4B] dark:bg-[#85275E] hover:bg-[#521539] rounded-xl shadow-sm"
                >
                  Continuar para Horário
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Data e Horário */}
          {bookingStep === 3 && (
            <div className="space-y-3">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                  3. Escolha o Dia e Horário Disponível:
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Horários em vermelho já estão ocupados para {selectedProfessional?.name}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Selecione o Dia:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl border border-gray-300 dark:border-[#422C3D] p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B] bg-white dark:bg-[#251A22] text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Horários Livres:</span>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" /> Livre
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-600" /> Ocupado
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {times.map((time) => {
                    const isOccupied = occupiedTimes.has(time);
                    const isSelected = selectedTime === time && !isOccupied;
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 text-xs rounded-xl font-bold border transition text-center ${
                          isOccupied
                            ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-400 dark:text-rose-600 border-rose-200 dark:border-rose-900/50 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white border-[#6B1D4B] dark:border-[#85275E] shadow-xs'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setBookingStep(2)}
                  className="flex-1 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#251A22] rounded-xl"
                >
                  Voltar
                </button>
                <button
                  disabled={!selectedTime || occupiedTimes.has(selectedTime)}
                  onClick={() => setBookingStep(4)}
                  className="flex-2 py-2.5 text-xs font-bold text-white bg-[#6B1D4B] dark:bg-[#85275E] hover:bg-[#521539] rounded-xl shadow-sm"
                >
                  Continuar para Seus Dados
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Seus Dados & Confirmação */}
          {bookingStep === 4 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                4. Confirme Seus Dados para o Atendimento:
              </h3>

              {/* Summary pill */}
              <div className="bg-pink-50 dark:bg-[#281824] p-3.5 rounded-2xl border border-pink-200 dark:border-[#42293C] space-y-1 text-xs">
                <p className="font-bold text-[#6B1D4B] dark:text-pink-300 flex items-center justify-between">
                  <span>✂️ {selectedService?.name}</span>
                  <span className="font-black text-sm">{selectedService && formatBRL(selectedService.price)}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Com: <strong>{selectedProfessional?.name}</strong> ({selectedProfessional?.role})
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Data e Horário: <strong>{selectedDate} às {selectedTime}</strong> ({selectedService?.durationMinutes} min)
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full text-xs rounded-xl border border-gray-300 dark:border-[#422C3D] bg-white dark:bg-[#251A22] text-gray-900 dark:text-gray-100 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Seu WhatsApp (com DDD) *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="11999998888"
                    className="w-full text-xs rounded-xl border border-gray-300 dark:border-[#422C3D] bg-white dark:bg-[#251A22] text-gray-900 dark:text-gray-100 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Preferências ou Avisos Capilares:
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Ex: Cabelo com mechas loiras, raiz sensível, prefere café com canela..."
                    className="w-full text-xs rounded-xl border border-gray-300 dark:border-[#422C3D] bg-white dark:bg-[#251A22] text-gray-900 dark:text-gray-100 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setBookingStep(3)}
                  className="flex-1 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#251A22] rounded-xl"
                >
                  Voltar
                </button>
                <button
                  onClick={handleBookingSubmit}
                  className="flex-2 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Sucesso / Conclusão */}
          {bookingStep === 5 && confirmedApp && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">Agendamento Realizado com Sucesso!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Seu horário foi reservado em tempo real no sistema do {salonName}.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-[#251A22] p-4 rounded-2xl border border-gray-200 dark:border-[#382633] max-w-sm mx-auto text-left text-xs space-y-1.5 text-gray-800 dark:text-gray-200">
                <p>
                  <strong>Cliente:</strong> {confirmedApp.clientName}
                </p>
                <p>
                  <strong>Serviço:</strong> {confirmedApp.serviceName} ({formatBRL(confirmedApp.price)})
                </p>
                <p>
                  <strong>Especialista:</strong> {confirmedApp.professionalName}
                </p>
                <p>
                  <strong>Data & Horário:</strong> {confirmedApp.dateStr} às {confirmedApp.timeStr}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                <button
                  onClick={() => addToGoogleCalendar(confirmedApp)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition flex items-center justify-center gap-1.5"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Adicionar à Agenda</span>
                </button>
                <button
                  onClick={() => {
                    const msg = `Olá! Acabei de agendar no ${salonName} pelo Portal:\n• Serviço: ${confirmedApp.serviceName}\n• Horário: ${confirmedApp.dateStr} às ${confirmedApp.timeStr}\n• Profissional: ${confirmedApp.professionalName}\nAnsiosa pelo atendimento! 💕`;
                    openWhatsApp(confirmedApp.clientPhone, msg);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-emerald-600 transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Avisar no WhatsApp</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setBookingStep(1);
                  setConfirmedApp(null);
                }}
                className="text-xs font-bold text-[#6B1D4B] dark:text-pink-400 hover:underline block mx-auto pt-2"
              >
                Fazer outro agendamento
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: MEUS AGENDAMENTOS */}
      {currentTab === 'MEUS_AGENDAMENTOS' && (
        <div className="bg-white dark:bg-[#1C141A] rounded-3xl border border-pink-100 dark:border-[#382633] p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-gray-100">Consultar Meus Horários:</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Digite seu telefone ou nome para visualizar seus atendimentos
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={lookupPhone}
              onChange={(e) => setLookupPhone(e.target.value)}
              placeholder="Digite seu WhatsApp ou Nome..."
              className="flex-1 text-xs rounded-xl border border-gray-300 dark:border-[#422C3D] bg-white dark:bg-[#251A22] text-gray-900 dark:text-gray-100 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
            {lookupPhone && (
              <button
                onClick={() => setLookupPhone('')}
                className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#251A22] rounded-xl border border-gray-200 dark:border-[#382633]"
              >
                Limpar
              </button>
            )}
          </div>

          {myAppointments.length === 0 ? (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Nenhum atendimento localizado.</p>
              <button
                onClick={() => setCurrentTab('AGENDAR')}
                className="mt-3 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#6B1D4B] dark:bg-[#85275E] text-white"
              >
                Agendar Agora
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myAppointments.map((app) => (
                <div
                  key={app.id}
                  className="bg-pink-50/40 border border-pink-100 rounded-2xl p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-900">{app.serviceName}</span>
                    <span className="font-bold text-emerald-800">{formatBRL(app.price)}</span>
                  </div>
                  <p className="text-gray-600">
                    Com: <strong>{app.professionalName}</strong> &bull; Data:{' '}
                    <strong>
                      {app.dateStr} às {app.timeStr}
                    </strong>
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-pink-100">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                        app.status === 'CONFIRMADO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'CANCELADO'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>

                    {app.status !== 'CANCELADO' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setRescheduleTarget(app);
                            setReschedDate(app.dateStr);
                            setReschedTime(app.timeStr);
                          }}
                          className="px-2.5 py-1 rounded-lg font-bold bg-white text-gray-700 hover:text-[#6B1D4B] border border-gray-200 text-[11px]"
                        >
                          Reagendar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Deseja realmente cancelar este horário?')) {
                              cancelAppointmentByClient(app.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px]"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: INSTALAR / ENVIAR APK */}
      {(currentTab === 'ENVIAR_APK' || currentTab === 'ENVIAR_WEB_APP') && (
        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs space-y-4">
          {/* Header Highlight Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-pink-50 p-4 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-emerald-900">
                <span className="text-lg">📲</span>
                <span>Portal do Cliente em APK para Celular</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                Android .APK &bull; ~22 MB
              </span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Envie o link do <strong>Aplicativo Oficial (.APK)</strong> via WhatsApp para suas clientes instalarem no celular Android. O aplicativo conecta diretamente à <strong>mesma base de dados em tempo real</strong> do salão!
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <a
                href="/portal-cliente.apk"
                download="vanira_e_vanessa_portal_cliente.apk"
                className="py-2 px-3.5 rounded-xl text-xs font-bold bg-[#6B1D4B] text-white hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5"
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
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                <span>Ver Página de Instalação</span>
              </a>
            </div>
          </div>

          {/* Quick Copy Link Box */}
          <div className="bg-pink-50/60 p-3 rounded-2xl border border-pink-200">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#6B1D4B] flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                <span>Link do Portal em APK:</span>
              </span>
              <button
                onClick={() => {
                  const url = getClientPortalUrl(selectedShareClient);
                  navigator.clipboard.writeText(url);
                  alert('Link do APK copiado com sucesso!');
                }}
                className="text-xs font-bold text-[#6B1D4B] hover:text-[#521539] bg-white px-2.5 py-1 rounded-lg border border-pink-200 transition shadow-2xs"
              >
                Copiar Link
              </button>
            </div>
            <p className="text-xs font-mono bg-white p-2 rounded-lg border border-pink-100 text-gray-700 select-all break-all">
              {getClientPortalUrl(selectedShareClient)}
            </p>
          </div>

          {/* WhatsApp Sending Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                1. Selecione a Cliente Cadastrada (ou digite abaixo):
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar cliente por nome ou WhatsApp..."
                  value={shareSearch}
                  onChange={(e) => setShareSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                />
              </div>

              {/* Matching Client list */}
              <div className="max-h-36 overflow-y-auto mt-2 space-y-1">
                {clients
                  .filter((c) =>
                    !shareSearch.trim()
                      ? true
                      : c.name.toLowerCase().includes(shareSearch.toLowerCase()) ||
                        c.phone.includes(shareSearch)
                  )
                  .slice(0, 5)
                  .map((c) => {
                    const isSelected = selectedShareClient?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedShareClient(c);
                          setCustomShareName(c.name);
                          setCustomSharePhone(c.phone);
                        }}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div>
                          <span>{c.name}</span>
                          <span className="text-gray-400 ml-1.5">({c.phone})</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                2. Destinatário WhatsApp:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome da Cliente"
                  value={customShareName}
                  onChange={(e) => setCustomShareName(e.target.value)}
                  className="text-xs rounded-xl border border-gray-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp com DDD"
                  value={customSharePhone}
                  onChange={(e) => setCustomSharePhone(e.target.value)}
                  className="text-xs rounded-xl border border-gray-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
                />
              </div>
            </div>

            {/* Preview of the message */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Visualização da Mensagem com Link do APK:
              </label>
              <pre className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-xl whitespace-pre-wrap font-sans text-gray-700 max-h-32 overflow-y-auto">
                {getClientPortalShareText(selectedShareClient)}
              </pre>
            </div>

            <button
              disabled={!customSharePhone.trim()}
              onClick={() => {
                const text = getClientPortalShareText(selectedShareClient);
                openWhatsApp(customSharePhone, text);
              }}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Send className="w-4 h-4" />
              <span>
                {customShareName
                  ? `Enviar Link do APK pelo WhatsApp para ${customShareName}`
                  : 'Enviar Link do APK pelo WhatsApp'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: DÚVIDAS & IA */}
      {currentTab === 'CONSULTORA_IA' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">
                Consultora Inteligente de Beleza do {salonName}
              </h3>
              <p className="text-xs text-gray-500">
                Tire dúvidas sobre tratamentos, mechas, cronograma capilar e cuidados
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-700">Perguntas Rápidas:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Como cuidar do loiro em casa?',
                'Qual a diferença entre hidratação e reconstrução?',
                'A progressiva tem formol?',
                'Como agendar mechas e corte juntos?',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setClientAiQuery(chip);
                    handleClientAiAsk(chip);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-pink-50 text-[#6B1D4B] hover:bg-pink-100 border border-pink-100 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite sua dúvida sobre seus cabelos..."
              value={clientAiQuery}
              onChange={(e) => setClientAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClientAiAsk(clientAiQuery)}
              className="flex-1 text-xs rounded-xl border border-gray-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
            <button
              disabled={clientAiLoading || !clientAiQuery.trim()}
              onClick={() => handleClientAiAsk(clientAiQuery)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] rounded-xl transition disabled:opacity-50"
            >
              {clientAiLoading ? 'Pensando...' : 'Perguntar'}
            </button>
          </div>

          {clientAiAnswer && (
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs text-purple-950 whitespace-pre-wrap leading-relaxed">
              {clientAiAnswer}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: MEU PERFIL */}
      {currentTab === 'MEUS_DADOS' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900">Seu Perfil no {salonName}:</h3>
            <p className="text-xs text-gray-500">
              Mantenha suas preferências capilares atualizadas para que a equipe prepare os produtos perfeitos.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeClientForPortal) {
                updateClient({
                  ...activeClientForPortal,
                  name: clientName,
                  phone: clientPhone,
                  hairPreferences: clientNotes,
                });
                alert('Dados atualizados com sucesso!');
              } else {
                alert('Informações salvas!');
              }
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 p-2.5"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 p-2.5"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Preferências Capilares e Cuidados
              </label>
              <textarea
                rows={3}
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="Ex: Mechas loiro mel, raiz esfumada, evita formol, couro sensível..."
                className="w-full text-xs rounded-xl border border-gray-300 p-2.5"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] rounded-xl transition shadow-xs"
            >
              Salvar Meus Dados
            </button>
          </form>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-pink-100 space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">
              Reagendar Horário: {rescheduleTarget.serviceName}
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nova Data:</label>
              <input
                type="date"
                value={reschedDate}
                onChange={(e) => setReschedDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Novo Horário:</label>
              <select
                value={reschedTime}
                onChange={(e) => setReschedTime(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 p-2 bg-white"
              >
                {times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRescheduleTarget(null)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const ok = rescheduleAppointment(
                    rescheduleTarget,
                    reschedDate,
                    reschedTime,
                    () => alert('Horário indisponível! Escolha outro horário livre.'),
                    () => {
                      alert('Reagendado com sucesso!');
                      setRescheduleTarget(null);
                    }
                  );
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#6B1D4B] rounded-xl"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
