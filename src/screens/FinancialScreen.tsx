import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { PaymentMethod, PaymentTransaction } from '../types';
import {
  DollarSign,
  Plus,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Trash2,
  CreditCard,
  TrendingUp,
  Receipt,
} from 'lucide-react';

interface FinancialScreenProps {
  onNewTransactionClick: () => void;
}

export const FinancialScreen: React.FC<FinancialScreenProps> = ({
  onNewTransactionClick,
}) => {
  const {
    transactions,
    markTransactionPaid,
    deleteTransaction,
    openWhatsApp,
    salonName,
  } = useSalon();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAGO' | 'PENDENTE'>('ALL');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalPaid = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'PAGO')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const totalPending = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'PENDENTE')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (statusFilter === 'ALL') return transactions;
    return transactions.filter((t) => t.status === statusFilter);
  }, [transactions, statusFilter]);

  const handleSendPixReminder = (tx: PaymentTransaction) => {
    const msg = `Olá, ${tx.clientName}! 💇‍♀️✨\nPassando com carinho do *${salonName}* referente ao atendimento de *${tx.serviceName}* no valor de *${formatBRL(tx.amount)}*.\n\nCaso queira acertar via PIX, nossa chave é o telefone do salão. Qualquer dúvida estamos à disposição! 💕`;
    openWhatsApp(tx.clientName, msg);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Controle Financeiro & Caixa</span>
            </h2>
            <p className="text-xs text-gray-500">
              Faturamento realizado, contas a receber e cobranças via WhatsApp
            </p>
          </div>

          <button
            onClick={onNewTransactionClick}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Lançamento</span>
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-1">
              Faturamento Recebido
            </span>
            <p className="text-2xl font-black text-emerald-700">{formatBRL(totalPaid)}</p>
            <span className="text-[11px] text-emerald-800 font-medium">
              {transactions.filter((t) => t.status === 'PAGO').length} pagamentos confirmados
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Contas a Receber
            </span>
            <p className="text-2xl font-black text-amber-800">{formatBRL(totalPending)}</p>
            <span className="text-[11px] text-amber-800 font-medium">
              {transactions.filter((t) => t.status === 'PENDENTE').length} pendências ativas
            </span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 sm:col-span-2 md:col-span-1">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-1">
              Volume Total Registrado
            </span>
            <p className="text-2xl font-black text-purple-900">
              {formatBRL(totalPaid + totalPending)}
            </p>
            <span className="text-[11px] text-purple-800 font-medium">
              {transactions.length} lançamentos no sistema
            </span>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'ALL'
                ? 'bg-gray-900 text-white font-bold'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({transactions.length})
          </button>
          <button
            onClick={() => setStatusFilter('PAGO')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'PAGO'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Pagos ({transactions.filter((t) => t.status === 'PAGO').length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDENTE')}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'PENDENTE'
                ? 'bg-amber-700 text-white font-bold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Pendentes ({transactions.filter((t) => t.status === 'PENDENTE').length})
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredTransactions.map((tx) => {
          const isPaid = tx.status === 'PAGO';
          return (
            <div
              key={tx.id}
              className="bg-white border border-pink-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-gray-900">{tx.clientName}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isPaid ? 'Pago' : 'Pendente'}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {tx.paymentMethod}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-1">
                  <span>✂️ {tx.serviceName}</span>
                  <span className="text-gray-300 mx-1.5">&bull;</span>
                  <span>Data: {tx.dateStr}</span>
                  {tx.dueDate && !isPaid && (
                    <span className="text-amber-700 font-semibold ml-1.5">
                      (Vencimento: {tx.dueDate})
                    </span>
                  )}
                </p>

                {tx.notes && <p className="text-xs text-gray-400 mt-0.5">{tx.notes}</p>}
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`text-base font-black ${
                    isPaid ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {formatBRL(tx.amount)}
                </span>

                {!isPaid ? (
                  <div className="flex items-center gap-1.5">
                    {/* Mark Paid Dropdown / Button */}
                    <button
                      onClick={() => markTransactionPaid(tx.id, 'PIX')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1"
                      title="Marcar como Pago via PIX"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pago (PIX)</span>
                    </button>

                    <button
                      onClick={() => handleSendPixReminder(tx)}
                      className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      title="Enviar Lembrete de Cobrança no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Recebido
                  </span>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Remover lançamento de ${tx.clientName}?`)) {
                      deleteTransaction(tx.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remover Lançamento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
