import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { X, Sparkles } from 'lucide-react';

interface EditSalonNameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditSalonNameModal: React.FC<EditSalonNameModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { salonName, updateSalonName } = useSalon();
  const [name, setName] = useState(salonName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateSalonName(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="font-extrabold text-lg text-gray-900">Nome do Salão</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nome Comercial de Exibição:
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vanira e Vanessa Salão Especializado"
              className="w-full text-sm rounded-xl border border-gray-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] rounded-xl transition shadow-sm"
            >
              Salvar Nome
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
