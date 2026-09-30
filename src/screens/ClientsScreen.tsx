import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { Client } from '../types';
import {
  Users,
  UserPlus,
  Search,
  MessageCircle,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
  Calendar,
  Sparkles,
  Phone,
} from 'lucide-react';

interface ClientsScreenProps {
  onNewClientClick: () => void;
  onEditClientClick: (client: Client) => void;
  onSharePortalForClient: (client: Client) => void;
}

export const ClientsScreen: React.FC<ClientsScreenProps> = ({
  onNewClientClick,
  onEditClientClick,
  onSharePortalForClient,
}) => {
  const {
    clients,
    deleteClient,
    openWhatsApp,
    openClientOnlyPortal,
    salonName,
    clientSearchQuery,
    updateClientSearch,
  } = useSalon();

  const [filterInactiveOnly, setFilterInactiveOnly] = useState(false);

  const sixtyDaysMillis = 60 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const inactiveClientsCount = useMemo(() => {
    return clients.filter((c) => now - (c.lastVisitTimestamp || 0) >= sixtyDaysMillis).length;
  }, [clients, now]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        !clientSearchQuery.trim() ||
        c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        c.phone.includes(clientSearchQuery) ||
        (c.hairPreferences && c.hairPreferences.toLowerCase().includes(clientSearchQuery.toLowerCase()));

      const isInactive = now - (c.lastVisitTimestamp || 0) >= sixtyDaysMillis;
      const matchInactive = !filterInactiveOnly || isInactive;

      return matchSearch && matchInactive;
    });
  }, [clients, clientSearchQuery, filterInactiveOnly, now]);

  const handleReturnMessage = (client: Client) => {
    const msg = `Olá, ${client.name}! 💇‍♀️✨\nSentimos sua falta no *${salonName}*!\nJá faz um tempinho desde seu último tratamento capilar.\n\nQue tal renovar o visual e cuidar dos fios esta semana com um mimo especial para você?\n\nResponda esta mensagem para escolhermos seu melhor horário! 💕`;
    openWhatsApp(client.phone, msg);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#6B1D4B]" />
              <span>Base de Clientes do Salão</span>
            </h2>
            <p className="text-xs text-gray-500">
              Histórico, preferências capilares e ações personalizadas de WhatsApp
            </p>
          </div>

          <button
            onClick={onNewClientClick}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Novo Cliente</span>
          </button>
        </div>

        {/* Search Bar & Inactive Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou histórico capilar..."
              value={clientSearchQuery}
              onChange={(e) => updateClientSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <button
            onClick={() => setFilterInactiveOnly(!filterInactiveOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              filterInactiveOnly
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Inativos há mais de 60 dias ({inactiveClientsCount})</span>
          </button>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <div className="bg-white border border-pink-100 rounded-3xl p-12 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <h3 className="text-base font-bold text-gray-700">Nenhum cliente encontrado.</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Altere a busca ou adicione um novo cliente.
            </p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const isInactive = now - (client.lastVisitTimestamp || 0) >= sixtyDaysMillis;
            const daysAbsent = Math.floor((now - (client.lastVisitTimestamp || 0)) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={client.id}
                className="bg-white border border-pink-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6B1D4B] font-extrabold flex items-center justify-center text-sm border border-purple-100 shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-base text-gray-900">{client.name}</h4>
                        {isInactive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Ausente há {daysAbsent} dias
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                          {client.token || 'cli_' + client.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{client.phone}</span>
                        {client.birthDate && <span>&bull; Aniversário: {client.birthDate}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {/* Retorno WhatsApp button */}
                    <button
                      onClick={() => handleReturnMessage(client)}
                      title="Enviar Mensagem de Retorno via WhatsApp"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Compartilhar Portal APK */}
                    <button
                      onClick={() => onSharePortalForClient(client)}
                      title="Enviar Link do Portal em APK via WhatsApp"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-pink-50 text-[#6B1D4B] hover:bg-pink-100 border border-pink-200 transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#6B1D4B]" />
                      <span>Enviar APK</span>
                    </button>

                    <button
                      onClick={() => onEditClientClick(client)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      title="Editar dados"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remover cliente ${client.name}?`)) {
                          deleteClient(client.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Remover cliente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                {(client.hairPreferences || client.notes || client.address) && (
                  <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {client.hairPreferences && (
                      <div className="bg-pink-50/50 p-2.5 rounded-xl border border-pink-100">
                        <span className="font-bold text-[#6B1D4B] block mb-0.5">
                          💇‍♀️ Preferências Capilares:
                        </span>
                        <p className="text-gray-700">{client.hairPreferences}</p>
                      </div>
                    )}
                    {client.notes && (
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                        <span className="font-bold text-gray-700 block mb-0.5">📝 Notas:</span>
                        <p className="text-gray-600">{client.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
