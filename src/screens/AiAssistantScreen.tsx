import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Bot, Send, Sparkles, Copy, Check, User } from 'lucide-react';

export const AiAssistantScreen: React.FC = () => {
  const { chatMessages, sendAiPrompt, isAiLoading, salonName } = useSalon();

  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    'Quanto faturei este mês e qual meu ticket médio?',
    'Quais clientes estão há mais de 60 dias sem voltar?',
    'Quanto tenho para receber em contas pendentes?',
    'Quais clientes fazem coloração e mechas?',
    'Gerar mensagem de retorno com carinho para WhatsApp',
    'Quais os horários mais livres hoje para encaixes?',
  ];

  const handleSend = async (text?: string) => {
    const promptToSend = text || inputPrompt;
    if (!promptToSend.trim() || isAiLoading) return;
    setInputPrompt('');
    await sendAiPrompt(promptToSend.trim());
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B1D4B] via-[#85275E] to-[#9E5471] rounded-3xl p-5 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0">
            🤖
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black">
              Assistente Executiva Inteligente • {salonName}
            </h2>
            <p className="text-xs text-pink-100 opacity-90 mt-0.5">
              Consultoria estratégica com base nos dados reais do seu salão em tempo real
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-white border border-pink-100 rounded-2xl p-3.5 shadow-xs">
        <span className="text-xs font-bold text-gray-700 block mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#6B1D4B]" />
          <span>Consultas Rápidas Sugeridas:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q) => (
            <button
              key={q}
              disabled={isAiLoading}
              onClick={() => handleSend(q)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-50 text-[#6B1D4B] hover:bg-pink-100 border border-pink-200 transition disabled:opacity-50 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs min-h-[380px] max-h-[520px] overflow-y-auto space-y-3.5">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#6B1D4B] flex items-center justify-center shrink-0 text-sm mt-0.5">
                  ✨
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#6B1D4B] text-white rounded-tr-xs shadow-xs'
                    : 'bg-gray-50 text-gray-800 rounded-tl-xs border border-gray-100 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {!isUser && (
                  <div className="flex justify-end pt-2 mt-1 border-t border-gray-200/50">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[11px] font-semibold text-gray-500 hover:text-[#6B1D4B] flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0 text-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAiLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 p-2">
            <span className="w-2 h-2 rounded-full bg-[#6B1D4B] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#6B1D4B] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#6B1D4B] animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 font-semibold">Analisando base do salão com IA...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 bg-white p-2 rounded-2xl border border-pink-200 shadow-xs"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Pergunte sobre clientes, faturamento, horários ou peça mensagens..."
          disabled={isAiLoading}
          className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-xl focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isAiLoading}
          className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#6B1D4B] hover:bg-[#521539] transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
};
