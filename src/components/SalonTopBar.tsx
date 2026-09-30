import React from 'react';
import { useSalon } from '../context/SalonContext';
import { AdminTab } from '../types';
import {
  Sparkles,
  Calendar,
  Users,
  Scissors,
  DollarSign,
  Package,
  UserCheck,
  Bot,
  BarChart3,
  Cloud,
  Share2,
  Database,
  Lock,
  Edit2,
  Smartphone,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';

interface SalonTopBarProps {
  onOpenEditName: () => void;
  onOpenSharePortal: () => void;
  onOpenBackup: () => void;
  onOpenAdminPin: () => void;
  onOpenInstall?: () => void;
}

export const SalonTopBar: React.FC<SalonTopBarProps> = ({
  onOpenEditName,
  onOpenSharePortal,
  onOpenBackup,
  onOpenAdminPin,
  onOpenInstall,
}) => {
  const {
    salonName,
    appMode,
    switchMode,
    currentAdminTab,
    selectAdminTab,
    isClientOnlyMode,
    isDarkMode,
    toggleDarkMode,
  } = useSalon();

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'DASHBOARD', label: 'Painel', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'AGENDA', label: 'Agenda', icon: <Calendar className="w-4 h-4" /> },
    { id: 'CLIENTES', label: 'Clientes', icon: <Users className="w-4 h-4" /> },
    { id: 'SERVICOS', label: 'Serviços', icon: <Scissors className="w-4 h-4" /> },
    { id: 'FINANCEIRO', label: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'ESTOQUE', label: 'Estoque', icon: <Package className="w-4 h-4" /> },
    { id: 'PROFISSIONAIS', label: 'Equipe', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'IA_ASSISTENTE', label: 'IA Assistente', icon: <Bot className="w-4 h-4" /> },
    { id: 'RELATORIOS', label: 'Relatórios', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'SUPABASE_CLOUD', label: 'Supabase Cloud', icon: <Cloud className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#181116]/95 backdrop-blur-md border-b border-pink-100 dark:border-[#30212C] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B1D4B] to-[#9E5471] flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0">
              💇‍♀️
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-extrabold text-[#201A1D] dark:text-[#F3ECF0] truncate">
                  {salonName}
                </h1>
                {!isClientOnlyMode && (
                  <button
                    onClick={onOpenEditName}
                    title="Editar Nome do Salão"
                    className="p-1 text-gray-400 hover:text-[#6B1D4B] dark:text-gray-500 dark:hover:text-pink-300 rounded-md transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-[#9E5471] dark:text-pink-300/80 font-medium hidden sm:block">
                Gestão Inteligente &bull; Vanira e Vanessa
              </p>
            </div>
          </div>

          {/* Quick Actions & Mode Switcher */}
          <div className="flex items-center gap-2">
            {/* Install Mobile App Button */}
            {onOpenInstall && (
              <button
                onClick={onOpenInstall}
                title="Instalar Aplicativo no Celular"
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#6B1D4B] to-[#9E5471] text-white shadow-xs hover:opacity-95 transition active:scale-95 shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5 text-pink-200" />
                <span className="hidden sm:inline">Instalar</span>
                <span>App</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              aria-label={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              className="p-2 rounded-xl text-gray-600 dark:text-pink-200 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-[#251A22] border border-gray-200 dark:border-[#3D2938] hover:bg-gray-100 dark:hover:bg-[#2F212C] transition shadow-2xs"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300 animate-fadeIn" />
              ) : (
                <Moon className="w-4 h-4 text-[#6B1D4B]" />
              )}
            </button>

            {!isClientOnlyMode ? (
              <>
                <button
                  onClick={onOpenSharePortal}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 transition shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Enviar APK WhatsApp</span>
                </button>

                <button
                  onClick={onOpenBackup}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-[#251A22] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#30212C] border border-transparent dark:border-[#382734] transition"
                  title="Backup & Restauração"
                >
                  <Database className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span>Backup</span>
                </button>

                {/* Mode switcher tabs */}
                <div className="flex bg-pink-50 dark:bg-[#251A22] p-1 rounded-xl border border-pink-100 dark:border-[#382633] text-xs font-bold">
                  <button
                    onClick={() => switchMode('ADMIN')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      appMode === 'ADMIN'
                        ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white shadow-xs'
                        : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Salão (Admin)
                  </button>
                  <button
                    onClick={() => switchMode('CLIENT_PORTAL')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                      appMode === 'CLIENT_PORTAL'
                        ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white shadow-xs'
                        : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Portal Cliente</span>
                  </button>
                </div>
              </>
            ) : (
              /* Device locked in client mode */
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Modo Cliente Protegido
                </span>
                <button
                  onClick={onOpenAdminPin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#6B1D4B] dark:bg-[#85275E] text-white hover:bg-[#521539] transition shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Acesso Salão (PIN)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Admin Mode Only) */}
        {appMode === 'ADMIN' && !isClientOnlyMode && (
          <nav className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {tabs.map((tab) => {
              const isActive = currentAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => selectAdminTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    isActive
                      ? 'bg-[#6B1D4B] dark:bg-[#85275E] text-white font-bold shadow-xs'
                      : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-[#281A23]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
