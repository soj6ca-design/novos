import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Client } from '../../types';
import { X, User, Phone, MapPin, Heart, Calendar } from 'lucide-react';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  clientToEdit,
}) => {
  const { addClient, updateClient } = useSalon();

  const [name, setName] = useState(clientToEdit?.name || '');
  const [phone, setPhone] = useState(clientToEdit?.phone || '');
  const [birthDate, setBirthDate] = useState(clientToEdit?.birthDate || '');
  const [address, setAddress] = useState(clientToEdit?.address || '');
  const [hairPreferences, setHairPreferences] = useState(clientToEdit?.hairPreferences || '');
  const [notes, setNotes] = useState(clientToEdit?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (clientToEdit) {
      updateClient({
        ...clientToEdit,
        name: name.trim(),
        phone: phone.trim(),
        birthDate: birthDate.trim(),
        address: address.trim(),
        hairPreferences: hairPreferences.trim(),
        notes: notes.trim(),
      });
    } else {
      addClient(
        name.trim(),
        phone.trim(),
        birthDate.trim(),
        address.trim(),
        hairPreferences.trim(),
        notes.trim()
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h3 className="font-extrabold text-lg text-gray-900">
              {clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mariana Silva"
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp (com DDD) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="11999998888"
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Data de Aniversário</label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Endereço</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, Número - Bairro, Cidade"
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Preferências Capilares / Químicas</label>
            <textarea
              value={hairPreferences}
              onChange={(e) => setHairPreferences(e.target.value)}
              placeholder="Ex: Mechas loiro mel 8.3, evita formol, raiz esfumada, cabelo 2B fino..."
              rows={2}
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Notas Gerais / Hábitos</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Gosta de café sem açúcar, prefere atendimentos às manhãs..."
              rows={2}
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
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
              {clientToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
