import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { SalonService } from '../types';
import { Scissors, Plus, Edit2, Trash2, Clock, Users, Sparkles } from 'lucide-react';

interface ServicesScreenProps {
  onNewServiceClick: () => void;
  onEditServiceClick: (service: SalonService) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  onNewServiceClick,
  onEditServiceClick,
}) => {
  const { services, professionals, deleteService } = useSalon();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const categories = useMemo(() => {
    return ['Todos', ...Array.from(new Set(services.map((s) => s.category))).sort()];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'Todos') return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#6B1D4B]" />
              <span>Menu de Serviços do Salão</span>
            </h2>
            <p className="text-xs text-gray-500">
              Valores, tempos de execução e profissionais designados
            </p>
          </div>

          <button
            onClick={onNewServiceClick}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Serviço</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold pt-1 border-t border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#6B1D4B] text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredServices.map((service) => {
          // Find executing professionals
          const assignedProfs = professionals.filter((p) => {
            if (service.professionalIdsCsv === 'all' || !service.professionalIdsCsv) return true;
            const ids = service.professionalIdsCsv.split(',').map(Number);
            return ids.includes(p.id);
          });

          return (
            <div
              key={service.id}
              className="bg-white border border-pink-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-base text-gray-900">{service.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-[#6B1D4B] font-bold border border-pink-100">
                        {service.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.durationMinutes} min</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-black text-[#6B1D4B] shrink-0">
                    {formatBRL(service.price)}
                  </span>
                </div>

                {service.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Footer: Profs & Edit/Delete */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1 text-[11px] truncate max-w-[220px]">
                  <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">
                    {assignedProfs.map((p) => p.name).join(', ') || 'Toda a Equipe'}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditServiceClick(service)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    title="Editar Serviço"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover serviço "${service.name}"?`)) {
                        deleteService(service.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Excluir Serviço"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
