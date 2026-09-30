import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Professional } from '../types';
import { UserCheck, Plus, Star, Phone, Edit2, Trash2, Scissors } from 'lucide-react';

interface ProfessionalsScreenProps {
  onNewProfessionalClick: () => void;
  onEditProfessionalClick: (prof: Professional) => void;
}

export const ProfessionalsScreen: React.FC<ProfessionalsScreenProps> = ({
  onNewProfessionalClick,
  onEditProfessionalClick,
}) => {
  const { professionals, services, deleteProfessional, updateProfessional } = useSalon();

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#6B1D4B]" />
              <span>Equipe de Especialistas</span>
            </h2>
            <p className="text-xs text-gray-500">
              Profissionais, avaliações dos clientes e atribuições de serviços
            </p>
          </div>

          <button
            onClick={onNewProfessionalClick}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Especialista</span>
          </button>
        </div>
      </div>

      {/* Grid of Professionals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {professionals.map((prof) => {
          const assignedServices = services.filter((s) => {
            if (prof.serviceIdsCsv === 'all' || !prof.serviceIdsCsv) return true;
            const ids = prof.serviceIdsCsv.split(',').map(Number);
            return ids.includes(s.id);
          });

          return (
            <div
              key={prof.id}
              className="bg-white border border-pink-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl shrink-0 border border-pink-200">
                      {prof.avatarEmoji}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-1.5">
                        <span>{prof.name}</span>
                        {!prof.active && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">
                            Inativa
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-semibold text-[#6B1D4B]">{prof.role}</p>
                      {prof.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{prof.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{prof.rating}</span>
                  </span>
                </div>

                {/* Assigned services */}
                <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-700 block mb-1.5">
                    ✂️ Serviços Atendidos ({assignedServices.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {assignedServices.slice(0, 5).map((s) => (
                      <span
                        key={s.id}
                        className="text-[10px] font-semibold bg-white text-gray-700 px-2 py-0.5 rounded-md border border-gray-200"
                      >
                        {s.name}
                      </span>
                    ))}
                    {assignedServices.length > 5 && (
                      <span className="text-[10px] font-bold text-[#6B1D4B] px-1 py-0.5">
                        +{assignedServices.length - 5} outros
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => updateProfessional({ ...prof, active: !prof.active })}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                    prof.active
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prof.active ? '● Ativa na Agenda' : '○ Pausada'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditProfessionalClick(prof)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    title="Editar profissional"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover "${prof.name}" da equipe?`)) {
                        deleteProfessional(prof.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remover profissional"
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
