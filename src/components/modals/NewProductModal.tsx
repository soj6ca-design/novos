import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Product } from '../../types';
import { X, Package } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct } = useSalon();

  const [name, setName] = useState(productToEdit?.name || '');
  const [brand, setBrand] = useState(productToEdit?.brand || '');
  const [category, setCategory] = useState(productToEdit?.category || 'Home Care');
  const [quantity, setQuantity] = useState(productToEdit ? String(productToEdit.quantityInStock) : '5');
  const [minAlert, setMinAlert] = useState(productToEdit ? String(productToEdit.minStockAlert) : '3');
  const [costPrice, setCostPrice] = useState(productToEdit ? String(productToEdit.costPrice) : '50');
  const [sellPrice, setSellPrice] = useState(productToEdit ? String(productToEdit.sellPrice) : '95');
  const [barcode, setBarcode] = useState(productToEdit?.barcode || '');
  const [description, setDescription] = useState(productToEdit?.description || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedQty = parseInt(quantity) || 0;
    const parsedMin = parseInt(minAlert) || 2;
    const parsedCost = parseFloat(costPrice.replace(',', '.')) || 0;
    const parsedSell = parseFloat(sellPrice.replace(',', '.')) || 0;

    if (productToEdit) {
      updateProduct({
        ...productToEdit,
        name: name.trim(),
        brand: brand.trim(),
        category: category.trim(),
        quantityInStock: parsedQty,
        minStockAlert: parsedMin,
        costPrice: parsedCost,
        sellPrice: parsedSell,
        barcode: barcode.trim(),
        description: description.trim(),
      });
    } else {
      addProduct(
        name.trim(),
        brand.trim(),
        category.trim(),
        parsedQty,
        parsedMin,
        parsedCost,
        parsedSell,
        barcode.trim(),
        description.trim()
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧴</span>
            <h3 className="font-extrabold text-lg text-gray-900">
              {productToEdit ? 'Editar Produto' : 'Novo Produto em Estoque'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Produto *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Óleo Reparador de Pontas 100ml"
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Marca / Linha</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Wella, Kérastase, Braé, Truss"
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              >
                <option value="Home Care">Home Care</option>
                <option value="Finalizadores">Finalizadores</option>
                <option value="Tratamento">Tratamento</option>
                <option value="Coloração">Coloração</option>
                <option value="Acessórios">Acessórios</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Qtd em Estoque</label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alerta Mínimo</label>
              <input
                type="number"
                min="1"
                required
                value={minAlert}
                onChange={(e) => setMinAlert(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Código de Barras / SKU</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="789..."
              className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Benefícios, modo de uso e notas..."
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
              {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
