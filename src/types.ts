export interface Professional {
  id: number;
  name: string;
  role: string;
  avatarEmoji: string;
  phone: string;
  active: boolean;
  rating: number;
  serviceIdsCsv: string; // "all" or CSV of service IDs
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  birthDate: string;
  address: string;
  hairPreferences: string;
  notes: string;
  token: string;
  registeredAt: number;
  lastVisitTimestamp: number;
}

export interface SalonService {
  id: number;
  name: string;
  category: string; // "Cabelo", "Química & Cor", "Unhas", "Tratamentos"
  price: number;
  durationMinutes: number;
  description: string;
  iconName: string;
  professionalIdsCsv: string; // "all" or CSV of professional IDs
}

export type AppointmentStatus = 'CONFIRMADO' | 'AGUARDANDO' | 'CONCLUIDO' | 'CANCELADO' | 'BLOQUEIO';

export interface Appointment {
  id: number;
  clientName: string;
  clientPhone: string;
  clientId: number | null;
  serviceId: number;
  serviceName: string;
  professionalId: number;
  professionalName: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes: string;
  googleCalendarEventId?: string | null;
  createdAt: number;
}

export type PaymentMethod = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO' | 'PENDENTE';
export type PaymentStatus = 'PAGO' | 'PENDENTE';

export interface PaymentTransaction {
  id: number;
  appointmentId?: number | null;
  clientName: string;
  serviceName: string;
  amount: number;
  dateStr: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  dueDate?: string;
  paidAt?: number | null;
  notes?: string;
}

export interface ScheduleBlock {
  id: number;
  professionalId: number;
  dateStr: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  reason: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  quantityInStock: number;
  minStockAlert: number;
  costPrice: number;
  sellPrice: number;
  barcode: string;
  description: string;
}

export type AppMode = 'ADMIN' | 'CLIENT_PORTAL';

export type AdminTab =
  | 'DASHBOARD'
  | 'AGENDA'
  | 'CLIENTES'
  | 'SERVICOS'
  | 'ESTOQUE'
  | 'FINANCEIRO'
  | 'PROFISSIONAIS'
  | 'IA_ASSISTENTE'
  | 'RELATORIOS'
  | 'SUPABASE_CLOUD';

export type ClientPortalTab =
  | 'AGENDAR'
  | 'MEUS_AGENDAMENTOS'
  | 'ENVIAR_APK'
  | 'ENVIAR_WEB_APP'
  | 'CONSULTORA_IA'
  | 'MEUS_DADOS';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  actionType?: string | null;
}

export interface BackupData {
  version: number;
  exportedAt: number;
  salonName: string;
  professionals: Professional[];
  services: SalonService[];
  clients: Client[];
  appointments: Appointment[];
  transactions: PaymentTransaction[];
  products: Product[];
  scheduleBlocks: ScheduleBlock[];
}
