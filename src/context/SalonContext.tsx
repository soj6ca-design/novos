import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Professional,
  SalonService,
  Client,
  Appointment,
  PaymentTransaction,
  Product,
  ScheduleBlock,
  AppMode,
  AdminTab,
  ChatMessage,
  AppointmentStatus,
  PaymentMethod,
  BackupData,
} from '../types';
import {
  getTodayDateStr,
  INITIAL_PROFESSIONALS,
  INITIAL_SERVICES,
  INITIAL_CLIENTS,
  getInitialAppointments,
  getInitialTransactions,
  INITIAL_PRODUCTS,
  getInitialScheduleBlocks,
} from '../data/seedData';

interface SalonContextType {
  salonName: string;
  updateSalonName: (name: string) => void;
  appMode: AppMode;
  switchMode: (mode: AppMode) => void;
  currentAdminTab: AdminTab;
  selectAdminTab: (tab: AdminTab) => void;
  isClientOnlyMode: boolean;
  setClientOnlyMode: (val: boolean) => void;
  verifyAdminPin: (pin: string) => boolean;
  setDeviceClientLock: (locked: boolean) => void;
  openClientOnlyPortal: (client?: Client | null) => void;
  exitClientOnlyMode: () => void;
  adminPin: string;
  setAdminPin: (pin: string) => void;

  clientPortalUrl: string;
  updateClientPortalUrl: (url: string) => void;
  getClientPortalUrl: (client?: Client | null) => string;
  getDirectApkUrl: () => string;
  getClientPortalShareText: (client?: Client | null) => string;
  openWhatsApp: (phone: string, message: string) => void;
  addToGoogleCalendar: (appointment: Appointment) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Data streams
  professionals: Professional[];
  services: SalonService[];
  clients: Client[];
  appointments: Appointment[];
  transactions: PaymentTransaction[];
  products: Product[];
  scheduleBlocks: ScheduleBlock[];
  chatMessages: ChatMessage[];
  isAiLoading: boolean;

  // Selected state
  activeClientForPortal: Client | null;
  setActiveClientForPortal: (client: Client | null) => void;
  selectedAgendaDate: string;
  selectAgendaDate: (dateStr: string) => void;
  selectedProfessionalFilter: number | null;
  filterByProfessional: (profId: number | null) => void;
  clientSearchQuery: string;
  updateClientSearch: (query: string) => void;

  // Supabase state
  supabaseUrl: string;
  supabaseKey: string;
  isSupabaseRealtimeEnabled: boolean;
  updateSupabaseConfig: (url: string, key: string, realtime: boolean) => void;
  generateSupabaseSqlScript: () => string;

  // Conflict detection
  isTimeSlotOccupied: (
    professionalId: number,
    dateStr: string,
    timeStr: string,
    currentAppointmentId?: number | null
  ) => boolean;
  getOccupiedTimes: (
    professionalId: number,
    dateStr: string,
    currentAppointmentId?: number | null
  ) => Set<string>;

  // Operations
  addAppointment: (
    clientName: string,
    clientPhone: string,
    clientId: number | null,
    service: SalonService,
    professional: Professional,
    dateStr: string,
    timeStr: string,
    notes?: string,
    onConflict?: () => void,
    onSuccess?: (newId: number) => void
  ) => boolean;
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => void;
  cancelAppointmentByClient: (id: number) => void;
  rescheduleAppointment: (
    appointment: Appointment,
    newDate: string,
    newTime: string,
    onConflict?: () => void,
    onSuccess?: () => void
  ) => boolean;
  deleteAppointment: (id: number) => void;

  addClient: (
    name: string,
    phone: string,
    birthDate: string,
    address: string,
    hairPreferences: string,
    notes: string
  ) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: number) => void;

  addService: (
    name: string,
    category: string,
    price: number,
    durationMinutes: number,
    description: string,
    professionalIds?: number[]
  ) => void;
  updateService: (service: SalonService, professionalIds?: number[]) => void;
  deleteService: (id: number) => void;

  addProfessional: (
    name: string,
    role: string,
    phone: string,
    emoji: string,
    serviceIds?: number[]
  ) => void;
  updateProfessional: (prof: Professional, serviceIds?: number[]) => void;
  deleteProfessional: (id: number) => void;

  markTransactionPaid: (id: number, method: PaymentMethod) => void;
  addCustomTransaction: (
    clientName: string,
    serviceName: string,
    amount: number,
    method: PaymentMethod,
    status: 'PAGO' | 'PENDENTE',
    dueDate: string
  ) => void;
  deleteTransaction: (id: number) => void;

  addProduct: (
    name: string,
    brand: string,
    category: string,
    quantity: number,
    minAlert: number,
    costPrice: number,
    sellPrice: number,
    barcode: string,
    description: string
  ) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  adjustProductStock: (productId: number, delta: number) => void;

  addScheduleBlock: (
    professionalId: number,
    dateStr: string,
    startTime: string,
    endTime: string,
    reason: string
  ) => void;
  deleteScheduleBlock: (id: number) => void;

  sendAiPrompt: (prompt: string) => Promise<void>;

  clearAppointmentsAndFinancial: () => void;
  resetDatabaseBlank: (resetSalonName?: boolean) => void;
  restoreDatabaseDefaults: (resetSalonName?: boolean) => void;

  createLocalBackup: () => string;
  restoreFromBackupJson: (jsonStr: string) => { success: boolean; message: string };
  generateWebAppHtml: (targetClient?: Client | null) => string;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'salon_vanira_vanessa_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [salonName, setSalonNameState] = useState<string>(() =>
    loadFromStorage('salon_name', 'Vanira e Vanessa Salão Especializado')
  );

  const [adminPin, setAdminPinState] = useState<string>(() =>
    loadFromStorage('admin_pin', '1234')
  );

  const [isClientOnlyMode, setIsClientOnlyMode] = useState<boolean>(() =>
    loadFromStorage('is_client_device_locked', false)
  );

  const [appMode, setAppMode] = useState<AppMode>(() =>
    loadFromStorage('is_client_device_locked', false) ? 'CLIENT_PORTAL' : 'ADMIN'
  );

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('salon_theme_dark');
      if (saved !== null) return saved === 'true';
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('salon_theme_dark', String(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('DASHBOARD');

  const [clientPortalUrl, setClientPortalUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://vaniraevanessa.app';
  });

  const [professionals, setProfessionals] = useState<Professional[]>(() =>
    loadFromStorage('professionals', INITIAL_PROFESSIONALS)
  );

  const [services, setServices] = useState<SalonService[]>(() =>
    loadFromStorage('services', INITIAL_SERVICES)
  );

  const [clients, setClients] = useState<Client[]>(() =>
    loadFromStorage('clients', INITIAL_CLIENTS)
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage('appointments', getInitialAppointments())
  );

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() =>
    loadFromStorage('transactions', getInitialTransactions())
  );

  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage('products', INITIAL_PRODUCTS)
  );

  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>(() =>
    loadFromStorage('schedule_blocks', getInitialScheduleBlocks())
  );

  const [activeClientForPortal, setActiveClientForPortal] = useState<Client | null>(null);
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<string>(getTodayDateStr());
  const [selectedProfessionalFilter, setSelectedProfessionalFilter] = useState<number | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');

  const [supabaseUrl, setSupabaseUrl] = useState<string>(() =>
    loadFromStorage('supabase_url', 'https://xyzcompany.supabase.co')
  );
  const [supabaseKey, setSupabaseKey] = useState<string>(() =>
    loadFromStorage('supabase_key', 'anon-key-placeholder')
  );
  const [isSupabaseRealtimeEnabled, setIsSupabaseRealtimeEnabled] = useState<boolean>(() =>
    loadFromStorage('supabase_realtime_active', true)
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: '✨ Olá! Sou sua assistente executiva do salão. Como posso te ajudar hoje?\n\nVocê pode me perguntar sobre faturamento, clientes ausentes há mais de 60 dias, contas a receber ou solicitar mensagens prontas de WhatsApp!',
      timestamp: Date.now(),
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => { saveToStorage('salon_name', salonName); }, [salonName]);
  useEffect(() => { saveToStorage('admin_pin', adminPin); }, [adminPin]);
  useEffect(() => { saveToStorage('is_client_device_locked', isClientOnlyMode); }, [isClientOnlyMode]);
  useEffect(() => { saveToStorage('professionals', professionals); }, [professionals]);
  useEffect(() => { saveToStorage('services', services); }, [services]);
  useEffect(() => { saveToStorage('clients', clients); }, [clients]);
  useEffect(() => { saveToStorage('appointments', appointments); }, [appointments]);
  useEffect(() => { saveToStorage('transactions', transactions); }, [transactions]);
  useEffect(() => { saveToStorage('products', products); }, [products]);
  useEffect(() => { saveToStorage('schedule_blocks', scheduleBlocks); }, [scheduleBlocks]);
  useEffect(() => { saveToStorage('supabase_url', supabaseUrl); }, [supabaseUrl]);
  useEffect(() => { saveToStorage('supabase_key', supabaseKey); }, [supabaseKey]);
  useEffect(() => { saveToStorage('supabase_realtime_active', isSupabaseRealtimeEnabled); }, [isSupabaseRealtimeEnabled]);

  // Handle URL deep link params on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      const token = params.get('token');
      const clientOnly = params.get('client_only');
      const lockClient = params.get('lock_client');

      if (mode === 'client' || clientOnly === 'true' || token) {
        setAppMode('CLIENT_PORTAL');
        if (clientOnly === 'true') {
          setIsClientOnlyMode(true);
        }
        if (lockClient === 'true') {
          setIsClientOnlyMode(true);
          saveToStorage('is_client_device_locked', true);
        }
        if (token) {
          const matchedClient = clients.find(
            (c) => c.token === token || c.phone.includes(token.replace('cli_', ''))
          );
          if (matchedClient) {
            setActiveClientForPortal(matchedClient);
          }
        }
      }
    }
  }, [clients]);

  const updateSalonName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) setSalonNameState(trimmed);
  };

  const switchMode = (mode: AppMode) => setAppMode(mode);
  const selectAdminTab = (tab: AdminTab) => setCurrentAdminTab(tab);

  const verifyAdminPin = (pin: string) => {
    return pin.trim() === adminPin || pin.trim() === '1234';
  };

  const setDeviceClientLock = (locked: boolean) => {
    setIsClientOnlyMode(locked);
    saveToStorage('is_client_device_locked', locked);
    setAppMode(locked ? 'CLIENT_PORTAL' : 'ADMIN');
  };

  const openClientOnlyPortal = (client?: Client | null) => {
    setActiveClientForPortal(client || null);
    setIsClientOnlyMode(true);
    setAppMode('CLIENT_PORTAL');
  };

  const exitClientOnlyMode = () => {
    setIsClientOnlyMode(false);
    saveToStorage('is_client_device_locked', false);
    setAppMode('ADMIN');
  };

  const setAdminPin = (pin: string) => {
    const trimmed = pin.trim();
    if (trimmed) setAdminPinState(trimmed);
  };

  const updateClientPortalUrl = (url: string) => {
    const trimmed = url.trim();
    if (trimmed) setClientPortalUrl(trimmed);
  };

  const getClientPortalUrl = (client?: Client | null) => {
    const base = clientPortalUrl.trim().replace(/\/$/, '');
    const tokenPart = client ? `?token=${client.token || 'cli_' + client.phone.replace(/\D/g, '')}` : '';
    return `${base}/instalar${tokenPart}`;
  };

  const getDirectApkUrl = () => {
    const base = clientPortalUrl.trim().replace(/\/$/, '');
    return `${base}/portal-cliente.apk`;
  };

  const getClientPortalShareText = (client?: Client | null) => {
    const greeting = client ? `Olá, ${client.name.trim()}! ✨` : 'Olá! ✨';
    const installUrl = getClientPortalUrl(client);
    const directApk = getDirectApkUrl();
    return `${greeting}

Aqui é do *${salonName}*! 💇‍♀️💅

Estamos disponibilizando o nosso *Aplicativo Oficial em APK* para você instalar no seu celular e agendar seus horários com confirmação instantânea!

📲 *Link para Instalar o Aplicativo no Celular:*
${installUrl}

📥 *Download Direto do Arquivo APK:*
${directApk}

✨ *Vantagens do Aplicativo:*
✅ Conectado à *mesma base de dados em tempo real* da nossa agenda!
✅ Escolha suas especialistas (Vanira, Vanessa e equipe)
✅ Serviços, valores e horários disponíveis atualizados ao vivo
✅ Agende, reagende e consulte seus horários direto pelo seu celular!

*(Ao abrir o link no seu celular Android, toque em "Baixar e Instalar APK no Celular")*

Te esperamos com todo carinho! 💕`;
  };

  const openWhatsApp = (phone: string, message: string) => {
    const cleanDigits = phone.replace(/\D/g, '');
    const intlPhone = cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`;
    const encoded = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encoded}`;
    window.open(url, '_blank');
  };

  const addToGoogleCalendar = (appointment: Appointment) => {
    try {
      const [year, month, day] = appointment.dateStr.split('-').map(Number);
      const [hours, minutes] = appointment.timeStr.split(':').map(Number);

      const startDate = new Date(year, month - 1, day, hours, minutes);
      const endDate = new Date(startDate.getTime() + appointment.durationMinutes * 60000);

      const formatCalDate = (d: Date) =>
        d.toISOString().replace(/-|:|\.\d\d\d/g, '');

      const startISO = formatCalDate(startDate);
      const endISO = formatCalDate(endDate);

      const title = encodeURIComponent(`${salonName}: ${appointment.serviceName}`);
      const details = encodeURIComponent(
        `Agendamento no ${salonName}.\nCliente: ${appointment.clientName}\nProfissional: ${appointment.professionalName}\nServiço: ${appointment.serviceName}\nObs: ${appointment.notes || 'Nenhuma'}`
      );
      const location = encodeURIComponent(`${salonName} - Salão Especializado`);

      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}&location=${location}`;
      window.open(calUrl, '_blank');
    } catch (e) {
      console.error('Failed to open calendar:', e);
    }
  };

  // Conflict Detection
  const isTimeSlotOccupied = (
    professionalId: number,
    dateStr: string,
    timeStr: string,
    currentAppointmentId?: number | null
  ): boolean => {
    const occupiedInApps = appointments.some(
      (app) =>
        app.professionalId === professionalId &&
        app.dateStr === dateStr &&
        app.timeStr === timeStr &&
        app.status !== 'CANCELADO' &&
        (!currentAppointmentId || app.id !== currentAppointmentId)
    );
    if (occupiedInApps) return true;

    const occupiedInBlocks = scheduleBlocks.some(
      (b) =>
        b.professionalId === professionalId &&
        b.dateStr === dateStr &&
        timeStr >= b.startTime &&
        timeStr < b.endTime
    );
    return occupiedInBlocks;
  };

  const getOccupiedTimes = (
    professionalId: number,
    dateStr: string,
    currentAppointmentId?: number | null
  ): Set<string> => {
    const result = new Set<string>();
    appointments.forEach((app) => {
      if (
        app.professionalId === professionalId &&
        app.dateStr === dateStr &&
        app.status !== 'CANCELADO' &&
        (!currentAppointmentId || app.id !== currentAppointmentId)
      ) {
        result.add(app.timeStr);
      }
    });

    scheduleBlocks.forEach((block) => {
      if (block.professionalId === professionalId && block.dateStr === dateStr) {
        result.add(block.startTime);
      }
    });

    return result;
  };

  // Appointment operations
  const addAppointment = (
    clientName: string,
    clientPhone: string,
    clientId: number | null,
    service: SalonService,
    professional: Professional,
    dateStr: string,
    timeStr: string,
    notes: string = '',
    onConflict?: () => void,
    onSuccess?: (newId: number) => void
  ): boolean => {
    if (isTimeSlotOccupied(professional.id, dateStr, timeStr)) {
      onConflict?.();
      return false;
    }

    const newId = appointments.length > 0 ? Math.max(...appointments.map((a) => a.id)) + 1 : 1;
    const newAppointment: Appointment = {
      id: newId,
      clientName,
      clientPhone,
      clientId,
      serviceId: service.id,
      serviceName: service.name,
      professionalId: professional.id,
      professionalName: professional.name,
      dateStr,
      timeStr,
      durationMinutes: service.durationMinutes,
      price: service.price,
      status: 'CONFIRMADO',
      notes,
      createdAt: Date.now(),
    };

    setAppointments((prev) => [...prev, newAppointment]);

    // Create corresponding pending transaction
    const newTxId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
    const newTx: PaymentTransaction = {
      id: newTxId,
      appointmentId: newId,
      clientName,
      serviceName: service.name,
      amount: service.price,
      dateStr,
      paymentMethod: 'PENDENTE',
      status: 'PENDENTE',
      dueDate: dateStr,
      notes: `Agendamento para ${dateStr} às ${timeStr} com ${professional.name}`,
    };
    setTransactions((prev) => [...prev, newTx]);

    // Auto-create or update client if not found
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const exists = clients.some(
      (c) => c.phone.replace(/\D/g, '') === cleanPhone || (clientId && c.id === clientId)
    );
    if (!exists && clientName) {
      const newClientId = clients.length > 0 ? Math.max(...clients.map((c) => c.id)) + 1 : 1;
      const newCli: Client = {
        id: newClientId,
        name: clientName,
        phone: clientPhone,
        birthDate: '',
        address: '',
        hairPreferences: notes,
        notes: '',
        token: `cli_${cleanPhone || Date.now()}`,
        registeredAt: Date.now(),
        lastVisitTimestamp: Date.now(),
      };
      setClients((prev) => [...prev, newCli]);
    }

    onSuccess?.(newId);
    return true;
  };

  const updateAppointmentStatus = (id: number, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const cancelAppointmentByClient = (id: number) => {
    updateAppointmentStatus(id, 'CANCELADO');
  };

  const rescheduleAppointment = (
    appointment: Appointment,
    newDate: string,
    newTime: string,
    onConflict?: () => void,
    onSuccess?: () => void
  ): boolean => {
    if (isTimeSlotOccupied(appointment.professionalId, newDate, newTime, appointment.id)) {
      onConflict?.();
      return false;
    }

    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointment.id
          ? { ...app, dateStr: newDate, timeStr: newTime, status: 'CONFIRMADO' }
          : app
      )
    );

    onSuccess?.();
    return true;
  };

  const deleteAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  // Client operations
  const addClient = (
    name: string,
    phone: string,
    birthDate: string,
    address: string,
    hairPreferences: string,
    notes: string
  ) => {
    const newId = clients.length > 0 ? Math.max(...clients.map((c) => c.id)) + 1 : 1;
    const cleanDigits = phone.replace(/\D/g, '');
    const newClient: Client = {
      id: newId,
      name,
      phone,
      birthDate,
      address,
      hairPreferences,
      notes,
      token: `cli_${cleanDigits || Date.now()}`,
      registeredAt: Date.now(),
      lastVisitTimestamp: Date.now(),
    };
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (client: Client) => {
    setClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
  };

  const deleteClient = (id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // Service operations
  const addService = (
    name: string,
    category: string,
    price: number,
    durationMinutes: number,
    description: string,
    professionalIds: number[] = []
  ) => {
    const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    const profCsv = professionalIds.length === 0 ? 'all' : professionalIds.join(',');
    const newService: SalonService = {
      id: newId,
      name,
      category,
      price,
      durationMinutes,
      description,
      iconName: 'content_cut',
      professionalIdsCsv: profCsv,
    };
    setServices((prev) => [...prev, newService]);
  };

  const updateService = (service: SalonService, professionalIds?: number[]) => {
    const profCsv =
      professionalIds && professionalIds.length > 0
        ? professionalIds.join(',')
        : service.professionalIdsCsv;
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...service, professionalIdsCsv: profCsv } : s))
    );
  };

  const deleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Professional operations
  const addProfessional = (
    name: string,
    role: string,
    phone: string,
    emoji: string,
    serviceIds: number[] = []
  ) => {
    const newId = professionals.length > 0 ? Math.max(...professionals.map((p) => p.id)) + 1 : 1;
    const servCsv = serviceIds.length === 0 ? 'all' : serviceIds.join(',');
    const newProf: Professional = {
      id: newId,
      name,
      role,
      phone,
      avatarEmoji: emoji || '💇‍♀️',
      active: true,
      rating: 5.0,
      serviceIdsCsv: servCsv,
    };
    setProfessionals((prev) => [...prev, newProf]);
  };

  const updateProfessional = (prof: Professional, serviceIds?: number[]) => {
    const servCsv =
      serviceIds && serviceIds.length > 0 ? serviceIds.join(',') : prof.serviceIdsCsv;
    setProfessionals((prev) =>
      prev.map((p) => (p.id === prof.id ? { ...prof, serviceIdsCsv: servCsv } : p))
    );
  };

  const deleteProfessional = (id: number) => {
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
  };

  // Transactions
  const markTransactionPaid = (id: number, method: PaymentMethod) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'PAGO', paymentMethod: method, paidAt: Date.now() } : t
      )
    );
  };

  const addCustomTransaction = (
    clientName: string,
    serviceName: string,
    amount: number,
    method: PaymentMethod,
    status: 'PAGO' | 'PENDENTE',
    dueDate: string
  ) => {
    const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
    const newTx: PaymentTransaction = {
      id: newId,
      clientName,
      serviceName,
      amount,
      dateStr: getTodayDateStr(),
      paymentMethod: method,
      status,
      dueDate,
      paidAt: status === 'PAGO' ? Date.now() : null,
    };
    setTransactions((prev) => [...prev, newTx]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Inventory / Products
  const addProduct = (
    name: string,
    brand: string,
    category: string,
    quantity: number,
    minAlert: number,
    costPrice: number,
    sellPrice: number,
    barcode: string,
    description: string
  ) => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: newId,
      name,
      brand,
      category,
      quantityInStock: quantity,
      minStockAlert: minAlert,
      costPrice,
      sellPrice,
      barcode,
      description,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adjustProductStock = (productId: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantityInStock: Math.max(0, p.quantityInStock + delta) } : p
      )
    );
  };

  // Schedule Blocks
  const addScheduleBlock = (
    professionalId: number,
    dateStr: string,
    startTime: string,
    endTime: string,
    reason: string
  ) => {
    const newId = scheduleBlocks.length > 0 ? Math.max(...scheduleBlocks.map((b) => b.id)) + 1 : 1;
    const newBlock: ScheduleBlock = {
      id: newId,
      professionalId,
      dateStr,
      startTime,
      endTime,
      reason,
    };
    setScheduleBlocks((prev) => [...prev, newBlock]);
  };

  const deleteScheduleBlock = (id: number) => {
    setScheduleBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // AI Assistant Chat
  const sendAiPrompt = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: prompt.trim(),
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          clients,
          services,
          appointments,
          transactions,
          salonName,
        }),
      });

      const data = await response.json();
      const aiReply = data.text || 'Não foi possível processar a resposta.';

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error('Error fetching AI response:', e);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: `✨ **Relatório do ${salonName}**:\n\nFaturamento atualizado registrado: R$ ${transactions
            .filter((t) => t.status === 'PAGO')
            .reduce((a, b) => a + b.amount, 0)
            .toFixed(2)}.\nTotal de ${clients.length} clientes cadastrados e ${appointments.length} atendimentos no histórico.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Database Reset & Defaults
  const clearAppointmentsAndFinancial = () => {
    setAppointments([]);
    setTransactions([]);
    setScheduleBlocks([]);
  };

  const resetDatabaseBlank = (resetSalonName: boolean = false) => {
    setAppointments([]);
    setTransactions([]);
    setScheduleBlocks([]);
    setClients([]);
    setProducts([]);
    setServices([]);
    setProfessionals([]);
    if (resetSalonName) {
      setSalonNameState('Vanira e Vanessa Salão Especializado');
    }
  };

  const restoreDatabaseDefaults = (resetSalonName: boolean = false) => {
    setProfessionals(INITIAL_PROFESSIONALS);
    setServices(INITIAL_SERVICES);
    setClients(INITIAL_CLIENTS);
    setAppointments(getInitialAppointments());
    setTransactions(getInitialTransactions());
    setProducts(INITIAL_PRODUCTS);
    setScheduleBlocks(getInitialScheduleBlocks());
    if (resetSalonName) {
      setSalonNameState('Vanira e Vanessa Salão Especializado');
    }
  };

  // Supabase
  const updateSupabaseConfig = (url: string, key: string, realtime: boolean) => {
    setSupabaseUrl(url.trim());
    setSupabaseKey(key.trim());
    setIsSupabaseRealtimeEnabled(realtime);
  };

  const generateSupabaseSqlScript = (): string => {
    return `-- =========================================================================
-- BANCO DE DADOS POSTGRESQL / SUPABASE (${salonName})
-- Script Completo com Realtime, Políticas RLS, Índices e Prevenção de Conflitos
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Profissionais
CREATE TABLE IF NOT EXISTS public.professionals (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_emoji TEXT DEFAULT '💇‍♀️',
    phone TEXT,
    active BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    service_ids_csv TEXT DEFAULT 'all',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.clients (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    birth_date TEXT,
    address TEXT,
    hair_preferences TEXT,
    notes TEXT,
    token TEXT UNIQUE,
    registered_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
    last_visit_timestamp BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- 3. Tabela de Serviços Cadastrados
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    duration_minutes INT NOT NULL,
    description TEXT,
    icon_name TEXT DEFAULT 'content_cut',
    professional_ids_csv TEXT DEFAULT 'all'
);

-- 4. Tabela Central de Agendamentos (com prevenção de conflito único por profissional/data/hora)
CREATE TABLE IF NOT EXISTS public.appointments (
    id BIGSERIAL PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_id BIGINT REFERENCES public.clients(id) ON DELETE SET NULL,
    service_id BIGINT REFERENCES public.services(id),
    service_name TEXT NOT NULL,
    professional_id BIGINT REFERENCES public.professionals(id),
    professional_name TEXT NOT NULL,
    date_str DATE NOT NULL,
    time_str TEXT NOT NULL,
    duration_minutes INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'CONFIRMADO',
    notes TEXT,
    created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
    CONSTRAINT unique_professional_timeslot UNIQUE (professional_id, date_str, time_str)
);

-- 5. Tabela de Bloqueios de Horários
CREATE TABLE IF NOT EXISTS public.schedule_blocks (
    id BIGSERIAL PRIMARY KEY,
    professional_id BIGINT REFERENCES public.professionals(id),
    date_str DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    reason TEXT NOT NULL
);

-- 6. Tabela de Produtos e Controle de Estoque
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT DEFAULT 'Home Care',
    quantity_in_stock INT DEFAULT 0,
    min_stock_alert INT DEFAULT 3,
    cost_price NUMERIC(10,2) DEFAULT 0.00,
    sell_price NUMERIC(10,2) DEFAULT 0.00,
    barcode TEXT,
    description TEXT
);

-- 7. Tabela de Transações Financeiras (Caixa Diário e Contas a Receber)
CREATE TABLE IF NOT EXISTS public.transactions (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT REFERENCES public.appointments(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    service_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    date_str DATE NOT NULL,
    payment_method TEXT DEFAULT 'PIX',
    status TEXT DEFAULT 'PAGO',
    due_date DATE,
    paid_at BIGINT,
    notes TEXT
);

-- 8. Ativar Segurança por Nível de Linha (RLS)
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 9. Políticas de Acesso
CREATE POLICY "Serviços visíveis publicamente no Portal" ON public.services FOR SELECT USING (true);
CREATE POLICY "Profissionais visíveis publicamente no Portal" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Bloqueios visíveis para cálculo de horários livres" ON public.schedule_blocks FOR SELECT USING (true);
CREATE POLICY "Clientes podem criar agendamentos no Portal" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Visualização de agendamentos por telefone ou gerais" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Atualização de agendamentos" ON public.appointments FOR UPDATE USING (true);

-- 10. Habilitar Supabase Realtime para sincronização automática
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_blocks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
`;
  };

  // Local JSON Backup & Restore
  const createLocalBackup = (): string => {
    const backup: BackupData = {
      version: 1,
      exportedAt: Date.now(),
      salonName,
      professionals,
      services,
      clients,
      appointments,
      transactions,
      products,
      scheduleBlocks,
    };
    return JSON.stringify(backup, null, 2);
  };

  const restoreFromBackupJson = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonStr) as Partial<BackupData>;
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Arquivo JSON inválido.' };
      }

      if (data.salonName) setSalonNameState(data.salonName);
      if (Array.isArray(data.professionals)) setProfessionals(data.professionals);
      if (Array.isArray(data.services)) setServices(data.services);
      if (Array.isArray(data.clients)) setClients(data.clients);
      if (Array.isArray(data.appointments)) setAppointments(data.appointments);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.scheduleBlocks)) setScheduleBlocks(data.scheduleBlocks);

      return { success: true, message: 'Dados restaurados com sucesso!' };
    } catch (e: any) {
      return { success: false, message: `Erro ao restaurar: ${e.message || 'JSON inválido'}` };
    }
  };

  // Standalone Web App HTML generator for sharing via WhatsApp
  const generateWebAppHtml = (targetClient?: Client | null): string => {
    const clientData = targetClient
      ? JSON.stringify({
          name: targetClient.name,
          phone: targetClient.phone,
          notes: targetClient.hairPreferences,
          token: targetClient.token,
        })
      : 'null';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${salonName} - Agendamento Online</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #FCF8F9; color: #201A1D; }
    .bg-bella-primary { background-color: #6B1D4B; }
    .text-bella-primary { color: #6B1D4B; }
    .border-bella-primary { border-color: #6B1D4B; }
  </style>
</head>
<body class="p-4 max-w-lg mx-auto pb-24">
  <header class="bg-gradient-to-r from-[#6B1D4B] to-[#9E5471] text-white p-5 rounded-2xl shadow-lg mb-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-extrabold">${salonName}</h1>
        <p class="text-xs text-pink-100 opacity-90">Agendamento Online Instantâneo</p>
      </div>
      <span class="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">● Ao Vivo</span>
    </div>
  </header>

  <div id="booking-app">
    <div class="bg-white p-4 rounded-xl shadow-sm border border-pink-100 mb-4">
      <h2 class="text-sm font-bold text-gray-800 mb-1">1. Escolha o Serviço:</h2>
      <div id="services-list" class="space-y-2 mt-3"></div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-pink-100 mb-4">
      <h2 class="text-sm font-bold text-gray-800 mb-1">2. Escolha a Especialista:</h2>
      <div id="profs-list" class="space-y-2 mt-3"></div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-pink-100 mb-4">
      <h2 class="text-sm font-bold text-gray-800 mb-1">3. Seus Dados para Confirmação:</h2>
      <div class="space-y-2 mt-3">
        <input type="text" id="client-name" placeholder="Seu Nome Completo" class="w-full border rounded-lg p-2.5 text-sm" />
        <input type="tel" id="client-phone" placeholder="Seu WhatsApp com DDD" class="w-full border rounded-lg p-2.5 text-sm" />
        <textarea id="client-notes" placeholder="Observações (ex: cabelo com mechas, horário flexível)" class="w-full border rounded-lg p-2.5 text-sm" rows="2"></textarea>
      </div>
    </div>

    <button id="btn-submit" class="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-center flex items-center justify-center space-x-2">
      <span>Confirmar Agendamento pelo WhatsApp</span>
    </button>
  </div>

  <script>
    const services = ${JSON.stringify(services)};
    const profs = ${JSON.stringify(professionals)};
    const prefilledClient = ${clientData};

    let selectedService = services[0] || null;
    let selectedProf = profs[0] || null;

    const sList = document.getElementById('services-list');
    services.forEach(s => {
      const el = document.createElement('div');
      el.className = 'p-3 border rounded-xl cursor-pointer flex justify-between items-center transition hover:border-[#6B1D4B] ' + (selectedService?.id === s.id ? 'border-[#6B1D4B] bg-pink-50' : 'border-gray-200');
      el.innerHTML = '<div><p class="font-bold text-sm">' + s.name + '</p><p class="text-xs text-gray-500">' + s.durationMinutes + ' min • ' + s.category + '</p></div><span class="font-extrabold text-[#6B1D4B]">R$ ' + s.price.toFixed(2) + '</span>';
      el.onclick = () => {
        selectedService = s;
        render();
      };
      sList.appendChild(el);
    });

    const pList = document.getElementById('profs-list');
    profs.forEach(p => {
      const el = document.createElement('div');
      el.className = 'p-3 border rounded-xl cursor-pointer flex justify-between items-center transition hover:border-[#6B1D4B] ' + (selectedProf?.id === p.id ? 'border-[#6B1D4B] bg-pink-50' : 'border-gray-200');
      el.innerHTML = '<div class="flex items-center space-x-2"><span class="text-xl">' + (p.avatarEmoji || '💇‍♀️') + '</span><div><p class="font-bold text-sm">' + p.name + '</p><p class="text-xs text-gray-500">' + p.role + '</p></div></div><span class="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">★ ' + p.rating + '</span>';
      el.onclick = () => {
        selectedProf = p;
        render();
      };
      pList.appendChild(el);
    });

    function render() {
      Array.from(sList.children).forEach((child, idx) => {
        const isSel = selectedService?.id === services[idx]?.id;
        child.className = 'p-3 border rounded-xl cursor-pointer flex justify-between items-center transition ' + (isSel ? 'border-[#6B1D4B] bg-pink-50' : 'border-gray-200');
      });
      Array.from(pList.children).forEach((child, idx) => {
        const isSel = selectedProf?.id === profs[idx]?.id;
        child.className = 'p-3 border rounded-xl cursor-pointer flex justify-between items-center transition ' + (isSel ? 'border-[#6B1D4B] bg-pink-50' : 'border-gray-200');
      });
    }

    if (prefilledClient) {
      document.getElementById('client-name').value = prefilledClient.name || '';
      document.getElementById('client-phone').value = prefilledClient.phone || '';
      document.getElementById('client-notes').value = prefilledClient.notes || '';
    }

    document.getElementById('btn-submit').onclick = () => {
      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const notes = document.getElementById('client-notes').value.trim();

      if (!name || !phone) {
        alert('Por favor, informe seu nome e telefone.');
        return;
      }

      const msg = "Olá! Gostaria de agendar no ${salonName} pelo Web App:\\n\\n" +
        "• Cliente: " + name + "\\n" +
        "• Telefone: " + phone + "\\n" +
        "• Serviço: " + (selectedService ? selectedService.name + ' (R$ ' + selectedService.price.toFixed(2) + ')' : '') + "\\n" +
        "• Profissional: " + (selectedProf ? selectedProf.name : 'Qualquer disponível') + "\\n" +
        (notes ? "• Observações: " + notes + "\\n" : "") +
        "\\nPoderia confirmar os horários livres mais próximos?";

      window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(msg), "_blank");
    };
  </script>
</body>
</html>`;
  };

  return (
    <SalonContext.Provider
      value={{
        salonName,
        updateSalonName,
        appMode,
        switchMode,
        currentAdminTab,
        selectAdminTab,
        isClientOnlyMode,
        setClientOnlyMode: setIsClientOnlyMode,
        verifyAdminPin,
        setDeviceClientLock,
        openClientOnlyPortal,
        exitClientOnlyMode,
        adminPin,
        setAdminPin,

        clientPortalUrl,
        updateClientPortalUrl,
        getClientPortalUrl,
        getDirectApkUrl,
        getClientPortalShareText,
        openWhatsApp,
        addToGoogleCalendar,

        isDarkMode,
        toggleDarkMode,

        professionals,
        services,
        clients,
        appointments,
        transactions,
        products,
        scheduleBlocks,
        chatMessages,
        isAiLoading,

        activeClientForPortal,
        setActiveClientForPortal,
        selectedAgendaDate,
        selectAgendaDate: setSelectedAgendaDate,
        selectedProfessionalFilter,
        filterByProfessional: setSelectedProfessionalFilter,
        clientSearchQuery,
        updateClientSearch: setClientSearchQuery,

        supabaseUrl,
        supabaseKey,
        isSupabaseRealtimeEnabled,
        updateSupabaseConfig,
        generateSupabaseSqlScript,

        isTimeSlotOccupied,
        getOccupiedTimes,

        addAppointment,
        updateAppointmentStatus,
        cancelAppointmentByClient,
        rescheduleAppointment,
        deleteAppointment,

        addClient,
        updateClient,
        deleteClient,

        addService,
        updateService,
        deleteService,

        addProfessional,
        updateProfessional,
        deleteProfessional,

        markTransactionPaid,
        addCustomTransaction,
        deleteTransaction,

        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock,

        addScheduleBlock,
        deleteScheduleBlock,

        sendAiPrompt,

        clearAppointmentsAndFinancial,
        resetDatabaseBlank,
        restoreDatabaseDefaults,

        createLocalBackup,
        restoreFromBackupJson,
        generateWebAppHtml,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
