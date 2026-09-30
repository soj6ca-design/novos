import React, { useState } from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { SalonTopBar } from './components/SalonTopBar';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { ScheduleScreen } from './screens/ScheduleScreen';
import { ClientPortalScreen } from './screens/ClientPortalScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { FinancialScreen } from './screens/FinancialScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ProfessionalsScreen } from './screens/ProfessionalsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { AiAssistantScreen } from './screens/AiAssistantScreen';
import { SupabaseConfigScreen } from './screens/SupabaseConfigScreen';
import { InstallApkScreen } from './screens/InstallApkScreen';

// Modals
import { NewAppointmentModal } from './components/modals/NewAppointmentModal';
import { NewClientModal } from './components/modals/NewClientModal';
import { NewServiceModal } from './components/modals/NewServiceModal';
import { NewProfessionalModal } from './components/modals/NewProfessionalModal';
import { NewScheduleBlockModal } from './components/modals/NewScheduleBlockModal';
import { NewTransactionModal } from './components/modals/NewTransactionModal';
import { NewProductModal } from './components/modals/NewProductModal';
import { ShareClientPortalModal } from './components/modals/ShareClientPortalModal';
import { DatabaseBackupModal } from './components/modals/DatabaseBackupModal';
import { ResetDataModal } from './components/modals/ResetDataModal';
import { AdminPinModal } from './components/modals/AdminPinModal';
import { EditSalonNameModal } from './components/modals/EditSalonNameModal';
import { InstallAppModal } from './components/modals/InstallAppModal';
import { Client, SalonService, Product, Professional } from './types';

const MainLayout: React.FC = () => {
  const { appMode, currentAdminTab } = useSalon();

  // Modals state
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<SalonService | null>(null);

  const [isNewProfOpen, setIsNewProfOpen] = useState(false);
  const [profToEdit, setProfToEdit] = useState<Professional | null>(null);

  const [isNewBlockOpen, setIsNewBlockOpen] = useState(false);
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);

  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isSharePortalOpen, setIsSharePortalOpen] = useState(false);
  const [shareTargetClient, setShareTargetClient] = useState<Client | null>(null);

  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isAdminPinOpen, setIsAdminPinOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const [isInstallRoute, setIsInstallRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname.startsWith('/instalar') ||
        new URLSearchParams(window.location.search).get('install') === 'true'
      );
    }
    return false;
  });

  const handleOpenClientEdit = (c: Client) => {
    setClientToEdit(c);
    setIsNewClientOpen(true);
  };

  const handleOpenServiceEdit = (s: SalonService) => {
    setServiceToEdit(s);
    setIsNewServiceOpen(true);
  };

  const handleOpenProfEdit = (p: Professional) => {
    setProfToEdit(p);
    setIsNewProfOpen(true);
  };

  const handleOpenProductEdit = (prod: Product) => {
    setProductToEdit(prod);
    setIsNewProductOpen(true);
  };

  const handleSharePortalForClient = (c: Client) => {
    setShareTargetClient(c);
    setIsSharePortalOpen(true);
  };

  if (isInstallRoute) {
    return (
      <InstallApkScreen
        onOpenWebPortal={() => {
          setIsInstallRoute(false);
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/?mode=client&client_only=true');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF8F9] dark:bg-[#120D10] text-gray-900 dark:text-[#F3ECF0] flex flex-col transition-colors duration-200">
      <SalonTopBar
        onOpenEditName={() => setIsEditNameOpen(true)}
        onOpenSharePortal={() => {
          setShareTargetClient(null);
          setIsSharePortalOpen(true);
        }}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenAdminPin={() => setIsAdminPinOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {appMode === 'CLIENT_PORTAL' ? (
          <ClientPortalScreen onOpenShareModal={() => setIsSharePortalOpen(true)} />
        ) : (
          <>
            {currentAdminTab === 'DASHBOARD' && (
              <DashboardScreen
                onNewAppointmentClick={() => setIsNewAppointmentOpen(true)}
                onSharePortalClick={() => setIsSharePortalOpen(true)}
                onBackupClick={() => setIsBackupOpen(true)}
                onResetClick={() => setIsResetOpen(true)}
                onNewClientClick={() => {
                  setClientToEdit(null);
                  setIsNewClientOpen(true);
                }}
                onNewServiceClick={() => {
                  setServiceToEdit(null);
                  setIsNewServiceOpen(true);
                }}
                onNewProfessionalClick={() => {
                  setProfToEdit(null);
                  setIsNewProfOpen(true);
                }}
              />
            )}

            {currentAdminTab === 'AGENDA' && (
              <ScheduleScreen
                onNewAppointmentClick={() => setIsNewAppointmentOpen(true)}
                onNewBlockClick={() => setIsNewBlockOpen(true)}
              />
            )}

            {currentAdminTab === 'CLIENTES' && (
              <ClientsScreen
                onNewClientClick={() => {
                  setClientToEdit(null);
                  setIsNewClientOpen(true);
                }}
                onEditClientClick={handleOpenClientEdit}
                onSharePortalForClient={handleSharePortalForClient}
              />
            )}

            {currentAdminTab === 'SERVICOS' && (
              <ServicesScreen
                onNewServiceClick={() => {
                  setServiceToEdit(null);
                  setIsNewServiceOpen(true);
                }}
                onEditServiceClick={handleOpenServiceEdit}
              />
            )}

            {currentAdminTab === 'FINANCEIRO' && (
              <FinancialScreen onNewTransactionClick={() => setIsNewTxOpen(true)} />
            )}

            {currentAdminTab === 'ESTOQUE' && (
              <InventoryScreen
                onNewProductClick={() => {
                  setProductToEdit(null);
                  setIsNewProductOpen(true);
                }}
                onEditProductClick={handleOpenProductEdit}
              />
            )}

            {currentAdminTab === 'PROFISSIONAIS' && (
              <ProfessionalsScreen
                onNewProfessionalClick={() => {
                  setProfToEdit(null);
                  setIsNewProfOpen(true);
                }}
                onEditProfessionalClick={handleOpenProfEdit}
              />
            )}

            {currentAdminTab === 'IA_ASSISTENTE' && <AiAssistantScreen />}

            {currentAdminTab === 'RELATORIOS' && <ReportsScreen />}

            {currentAdminTab === 'SUPABASE_CLOUD' && <SupabaseConfigScreen />}
          </>
        )}
      </main>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => {
          setIsNewClientOpen(false);
          setClientToEdit(null);
        }}
        clientToEdit={clientToEdit}
      />

      <NewServiceModal
        isOpen={isNewServiceOpen}
        onClose={() => {
          setIsNewServiceOpen(false);
          setServiceToEdit(null);
        }}
        serviceToEdit={serviceToEdit}
      />

      <NewProfessionalModal
        isOpen={isNewProfOpen}
        onClose={() => {
          setIsNewProfOpen(false);
          setProfToEdit(null);
        }}
        professionalToEdit={profToEdit}
      />

      <NewScheduleBlockModal
        isOpen={isNewBlockOpen}
        onClose={() => setIsNewBlockOpen(false)}
      />

      <NewTransactionModal
        isOpen={isNewTxOpen}
        onClose={() => setIsNewTxOpen(false)}
      />

      <NewProductModal
        isOpen={isNewProductOpen}
        onClose={() => {
          setIsNewProductOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
      />

      <ShareClientPortalModal
        isOpen={isSharePortalOpen}
        onClose={() => {
          setIsSharePortalOpen(false);
          setShareTargetClient(null);
        }}
        targetClient={shareTargetClient}
      />

      <DatabaseBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      <ResetDataModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />

      <AdminPinModal
        isOpen={isAdminPinOpen}
        onClose={() => setIsAdminPinOpen(false)}
      />

      <EditSalonNameModal
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
      />

      {/* Floating Install App Button on Mobile */}
      <button
        onClick={() => setIsInstallModalOpen(true)}
        title="Instalar Aplicativo no Celular"
        className="fixed bottom-5 right-4 z-40 sm:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#6B1D4B] via-[#85275E] to-[#9E5471] text-white font-extrabold text-xs shadow-2xl border-2 border-pink-200/60 active:scale-95 transition"
      >
        <img
          src="/images/icon-192.png"
          alt="App Icon"
          className="w-5 h-5 rounded-full object-cover border border-white"
        />
        <span>Instalar no Celular</span>
      </button>

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />
    </div>
  );
};

export function App() {
  return (
    <SalonProvider>
      <MainLayout />
    </SalonProvider>
  );
}

export default App;
