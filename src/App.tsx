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
