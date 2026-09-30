import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { Product } from '../types';
import {
  Package,
  Plus,
  AlertTriangle,
  Minus,
  Edit2,
  Trash2,
  Barcode,
  Search,
} from 'lucide-react';

interface InventoryScreenProps {
  onNewProductClick: () => void;
  onEditProductClick: (product: Product) => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  onNewProductClick,
  onEditProductClick,
}) => {
  const { products, deleteProduct, adjustProductStock } = useSalon();

  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [search, setSearch] = useState<string>('');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const categories = useMemo(() => {
    return ['Todos', ...Array.from(new Set(products.map((p) => p.category))).sort()];
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.quantityInStock <= p.minStockAlert).length;
  }, [products]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + (Number(p.sellPrice) || 0) * (Number(p.quantityInStock) || 0),
      0
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = categoryFilter === 'Todos' || p.category === categoryFilter;
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search);
      return matchCat && matchSearch;
    });
  }, [products, categoryFilter, search]);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-700" />
              <span>Controle de Estoque & Produtos</span>
            </h2>
            <p className="text-xs text-gray-500">
              Gestão de produtos para revenda, consumo interno e alertas de reposição
            </p>
          </div>

          <button
            onClick={onNewProductClick}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Produto</span>
          </button>
        </div>

        {/* Inventory Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
            <span className="text-xs font-bold text-amber-900 block mb-1">
              Produtos com Estoque Baixo
            </span>
            <p className="text-2xl font-black text-amber-800">{lowStockCount}</p>
            <span className="text-[11px] text-amber-700">Abaixo da margem mínima</span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5">
            <span className="text-xs font-bold text-purple-900 block mb-1">
              Valor Total do Estoque
            </span>
            <p className="text-2xl font-black text-[#6B1D4B]">{formatBRL(totalInventoryValue)}</p>
            <span className="text-[11px] text-purple-700">Preço de venda estimado</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
            <span className="text-xs font-bold text-emerald-900 block mb-1">
              Itens Cadastrados
            </span>
            <p className="text-2xl font-black text-emerald-800">{products.length}</p>
            <span className="text-[11px] text-emerald-700">Linhas ativas</span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-gray-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome, marca ou código de barras..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-[#6B1D4B] text-white font-bold shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredProducts.map((prod) => {
          const isLow = prod.quantityInStock <= prod.minStockAlert;
          return (
            <div
              key={prod.id}
              className={`bg-white border rounded-2xl p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-3 ${
                isLow ? 'border-amber-300 ring-1 ring-amber-200' : 'border-pink-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-base text-gray-900">{prod.name}</h4>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                      {prod.brand} &bull; {prod.category}
                    </p>
                  </div>
                  {isLow && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      Estoque Baixo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-3 bg-gray-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Preço de Venda:</span>
                    <strong className="text-emerald-700 font-bold">
                      {formatBRL(prod.sellPrice)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Preço de Custo:</span>
                    <span className="text-gray-700 font-medium">
                      {formatBRL(prod.costPrice)}
                    </span>
                  </div>
                </div>

                {prod.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{prod.description}</p>
                )}
              </div>

              {/* Stock Stepper & Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                {/* Stepper */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-semibold">Qtd:</span>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                    <button
                      onClick={() => adjustProductStock(prod.id, -1)}
                      className="p-1 rounded-md bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 shadow-2xs"
                      title="Diminuir estoque"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span
                      className={`px-2 text-xs font-black min-w-[24px] text-center ${
                        isLow ? 'text-amber-800' : 'text-gray-900'
                      }`}
                    >
                      {prod.quantityInStock}
                    </span>
                    <button
                      onClick={() => adjustProductStock(prod.id, 1)}
                      className="p-1 rounded-md bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 shadow-2xs"
                      title="Aumentar estoque"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400">mín: {prod.minStockAlert}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditProductClick(prod)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    title="Editar produto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover produto "${prod.name}"?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Excluir produto"
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
