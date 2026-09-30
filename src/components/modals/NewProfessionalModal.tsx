import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Professional } from '../../types';
import { X } from 'lucide-react';

interface NewProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalToEdit?: Professional | null;
}

export const NewProfessionalModal: React.FC<NewProfessionalModalProps> = ({
  isOpen,
  onClose,
  professionalToEdit,
}) => {
  const { addProfessional, updateProfessional, services } = useSalon();

  const [name, setName] = useState(professionalToEdit?.name || '');
  const [role, setRole] = useState(professionalToEdit?.role || '');
  const [phone, setPhone] = useState(professionalToEdit?.phone || '');
  const [emoji, setEmoji] = useState(professionalToEdit?.avatarEmoji || '💇‍♀️');

  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(() => {
    if (!professionalToEdit || professionalToEdit.serviceIdsCsv === 'all' || !professionalToEdit.serviceIdsCsv) {
      return services.map((s) => s.id);
    }
    return professionalToEdit.serviceIdsCsv
      .split(',')
      .map((id) => Number(id.trim()))
      .filter(Boolean);
  });

  if (!isOpen) return null;

  const toggleService = (id: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const emojiOptions = ['💇‍♀️', '✨', '💅', '💆‍♀️', '💄', '✂️', '👑', '🌸'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    if (professionalToEdit) {
      updateProfessional(
        {
          ...professionalToEdit,
          name: name.trim(),
          role: role.trim(),
          phone: phone.trim(),
          avatarEmoji: emoji,
        },
        selectedServiceIds
      );
    } else {
      addProfessional(
        name.trim(),
        role.trim(),
        phone.trim(),
        emoji,
        selectedServiceIds
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <h3 className="font-extrabold text-lg text-gray-900">
              {professionalToEdit ? 'Editar Especialista' : 'Nova Especialista'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Emoji selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Ícone / Emoji:</label>
            <div className="flex gap-2">
              {emojiOptions.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition ${
                    emoji === em
                      ? 'bg-pink-100 border-[#6B1D4B] scale-110 shadow-xs'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vanira ou Vanessa"
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Especialidade / Cargo *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Cabeleireira & Visagista"
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98111-2233"
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Serviços que Atende ({selectedServiceIds.length} selecionados):
            </label>
            <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-gray-50 border border-gray-200">
              {services.map((s) => {
                const isChecked = selectedServiceIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleService(s.id)}
                      className="rounded text-[#6B1D4B] focus:ring-[#6B1D4B]"
                    />
                    <span className="font-semibold text-gray-800">{s.name}</span>
                    <span className="text-gray-400">({s.category})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#53163a] rounded-xl transition shadow-sm"
            >
              {professionalToEdit ? 'Salvar Alterações' : 'Cadastrar Especialista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
