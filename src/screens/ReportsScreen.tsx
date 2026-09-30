import React, { useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Scissors,
  CheckCircle2,
  DollarSign,
  PieChart,
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { appointments, transactions, clients, services, professionals } = useSalon();

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'PAGO')
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const paidTransactions = useMemo(() => {
    return transactions.filter((t) => t.status === 'PAGO');
  }, [transactions]);

  const avgTicket = paidTransactions.length > 0 ? totalRevenue / paidTransactions.length : 0;

  // Service distribution
  const serviceStats = useMemo(() => {
    const counts: Record<string, { count: number; revenue: number }> = {};
    for (const a of appointments) {
      if (!counts[a.serviceName]) {
        counts[a.serviceName] = { count: 0, revenue: 0 };
      }
      counts[a.serviceName].count += 1;
      counts[a.serviceName].revenue += a.price;
    }
    return Object.entries(counts)
      .map(([name, stat]) => ({ name, ...stat }))
      .sort((a, b) => b.count - a.count);
  }, [appointments]);

  // Professional distribution
  const professionalStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of appointments) {
      counts[a.professionalName] = (counts[a.professionalName] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [appointments]);

  // Payment method distribution
  const paymentStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of transactions) {
      counts[t.paymentMethod] = (counts[t.paymentMethod] || 0) + 1;
    }
    return Object.entries(counts).map(([method, count]) => ({ method, count }));
  }, [transactions]);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#6B1D4B]" />
            <span>Relatórios & Desempenho do Salão</span>
          </h2>
          <p className="text-xs text-gray-500">
            Métricas de faturamento, serviços mais procurados e retenção de clientes
          </p>
        </div>

        {/* Big Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <span className="text-xs font-bold text-purple-900 block mb-1">
              Faturamento Pago
            </span>
            <p className="text-2xl font-black text-[#6B1D4B]">{formatBRL(totalRevenue)}</p>
            <span className="text-[11px] text-purple-700">Volume recebido em caixa</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <span className="text-xs font-bold text-emerald-900 block mb-1">Ticket Médio</span>
            <p className="text-2xl font-black text-emerald-800">{formatBRL(avgTicket)}</p>
            <span className="text-[11px] text-emerald-700">Por atendimento concluído</span>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <span className="text-xs font-bold text-blue-900 block mb-1">Total de Atendimentos</span>
            <p className="text-2xl font-black text-blue-800">{appointments.length}</p>
            <span className="text-[11px] text-blue-700">Horários registrados</span>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <span className="text-xs font-bold text-amber-900 block mb-1">Base de Clientes</span>
            <p className="text-2xl font-black text-amber-800">{clients.length}</p>
            <span className="text-[11px] text-amber-700">Clientes cadastrados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Services */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[#6B1D4B]" />
            <span>Serviços Mais Procurados</span>
          </h3>

          <div className="space-y-3">
            {serviceStats.slice(0, 6).map((item, idx) => {
              const maxCount = serviceStats[0]?.count || 1;
              const percentage = Math.round((item.count / maxCount) * 100);

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-800 truncate max-w-[200px]">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="text-[#6B1D4B] font-bold">
                      {item.count} agend. ({formatBRL(item.revenue)})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-pink-50 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6B1D4B] to-[#9E5471] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Professionals */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6B1D4B]" />
            <span>Atendimentos por Especialista</span>
          </h3>

          <div className="space-y-2.5">
            {professionals.map((prof) => {
              const count = appointments.filter((a) => a.professionalId === prof.id).length;
              const revenue = appointments
                .filter((a) => a.professionalId === prof.id && a.status !== 'CANCELADO')
                .reduce((acc, a) => acc + a.price, 0);

              return (
                <div
                  key={prof.id}
                  className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{prof.avatarEmoji}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{prof.name}</h4>
                      <p className="text-[11px] text-gray-500">{prof.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#6B1D4B] text-sm block">
                      {count} atend.
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold">
                      {formatBRL(revenue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment methods breakdown */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs">
        <h3 className="font-extrabold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Formas de Pagamento Utilizadas</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {paymentStats.map((ps) => (
            <div key={ps.method} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
              <span className="text-xs font-semibold text-gray-600 block">{ps.method}</span>
              <strong className="text-lg font-black text-gray-900 block mt-0.5">{ps.count}</strong>
              <span className="text-[10px] text-gray-400">lançamentos</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
