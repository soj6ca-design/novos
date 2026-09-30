import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { SalonService } from '../../types';
import { X } from 'lucide-react';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: SalonService | null;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
}) => {
  const { addService, updateService, professionals } = useSalon();

  const [name, setName] = useState(serviceToEdit?.name || '');
  const [category, setCategory] = useState(serviceToEdit?.category || 'Cabelo');
  const [price, setPrice] = useState(serviceToEdit?.price ? String(serviceToEdit.price) : '80');
  const [durationMinutes, setDurationMinutes] = useState(
    serviceToEdit?.durationMinutes ? String(serviceToEdit.durationMinutes) : '45'
  );
  const [description, setDescription] = useState(serviceToEdit?.description || '');

  const [selectedProfIds, setSelectedProfIds] = useState<number[]>(() => {
    if (!serviceToEdit || serviceToEdit.professionalIdsCsv === 'all' || !serviceToEdit.professionalIdsCsv) {
      return professionals.map((p) => p.id);
    }
    return serviceToEdit.professionalIdsCsv
      .split(',')
      .map((id) => Number(id.trim()))
      .filter(Boolean);
  });

  if (!isOpen) return null;

  const toggleProf = (id: number) => {
    setSelectedProfIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price.replace(',', '.')) || 0;
    const parsedDuration = parseInt(durationMinutes) || 45;

    if (serviceToEdit) {
      updateService(
        {
          ...serviceToEdit,
          name: name.trim(),
          category: category.trim(),
          price: parsedPrice,
          durationMinutes: parsedDuration,
          description: description.trim(),
        },
        selectedProfIds
      );
    } else {
      addService(
        name.trim(),
        category.trim(),
        parsedPrice,
        parsedDuration,
        description.trim(),
        selectedProfIds
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✂️</span>
            <h3 className="font-extrabold text-lg text-gray-900">
              {serviceToEdit ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Serviço *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Morena Iluminada com Matização"
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              >
                <option value="Cabelo">Cabelo</option>
                <option value="Química & Cor">Química & Cor</option>
                <option value="Tratamentos">Tratamentos</option>
                <option value="Unhas">Unhas</option>
                <option value="Estética">Estética</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="80.00"
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Duração (min) *</label>
              <input
                type="number"
                step="5"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="45"
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva etapas do procedimento, benefícios e produtos inclusos..."
              rows={2}
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Profissionais que Executam este Serviço:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {professionals.map((p) => {
                const isChecked = selectedProfIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProf(p.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition text-left ${
                      isChecked
                        ? 'bg-pink-50 border-[#6B1D4B] text-[#6B1D4B]'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <span>{p.avatarEmoji}</span>
                    <span className="truncate">{p.name}</span>
                  </button>
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
              {serviceToEdit ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
