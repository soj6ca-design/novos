import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Cloud, Copy, Check, Database, ShieldCheck, Zap } from 'lucide-react';

export const SupabaseConfigScreen: React.FC = () => {
  const {
    supabaseUrl,
    supabaseKey,
    isSupabaseRealtimeEnabled,
    updateSupabaseConfig,
    generateSupabaseSqlScript,
    salonName,
  } = useSalon();

  const [url, setUrl] = useState(supabaseUrl);
  const [key, setKey] = useState(supabaseKey);
  const [realtime, setRealtime] = useState(isSupabaseRealtimeEnabled);
  const [saved, setSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlScript = generateSupabaseSqlScript();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig(url, key, realtime);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shrink-0">
            ☁️
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>Sincronização em Nuvem &bull; Supabase / PostgreSQL</span>
            </h2>
            <p className="text-xs text-gray-500">
              Sincronize a agenda do salão com banco relacional com suporte a Realtime
            </p>
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            ✓ Configurações salvas com sucesso!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Supabase Project URL:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full text-xs rounded-xl border border-gray-300 p-2.5 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Supabase Anon Public Key:
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full text-xs rounded-xl border border-gray-300 p-2.5 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#6B1D4B]"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={realtime}
              onChange={(e) => setRealtime(e.target.checked)}
              className="rounded text-[#6B1D4B] focus:ring-[#6B1D4B]"
            />
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Habilitar Sincronização em Tempo Real (Supabase Realtime)</span>
            </div>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition shadow-xs"
          >
            Salvar Configurações da Nuvem
          </button>
        </form>
      </div>

      {/* SQL Generator */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#6B1D4B]" />
              <span>Script SQL Completo para Supabase / PostgreSQL</span>
            </h3>
            <p className="text-xs text-gray-500">
              Cole no SQL Editor do seu Supabase para criar todas as tabelas e políticas RLS
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#6B1D4B] text-white hover:bg-[#521539] transition shadow-xs flex items-center gap-1.5 shrink-0"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar SQL</span>
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <pre className="text-[11px] font-mono bg-gray-900 text-gray-100 p-4 rounded-2xl overflow-x-auto max-h-96 scrollbar-thin">
            {sqlScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
