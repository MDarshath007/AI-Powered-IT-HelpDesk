import { useLocation } from 'react-router-dom';
import { Bot, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function AIAssistant() {
  const location = useLocation();
  const initialPrompt = location.state?.initialPrompt || '';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI IT Helpdesk Assistant
            </h2>
            <p className="text-xs text-slate-500">
              Specialized in Windows troubleshooting, Network connectivity, and Software configuration.
            </p>
          </div>
        </div>

        {/* Phase preview note */}
        <div className="my-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900">
            <p className="font-semibold mb-0.5">Frontend layout initialized (Phase 1)</p>
            <p className="text-indigo-700">
              Active Gemini API streaming and conversational chat responses will be wired in Phase 5 after the Express backend setup.
            </p>
          </div>
        </div>

        {/* Mock chat preview */}
        <div className="space-y-4 min-h-[260px] p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
          {/* Bot welcome message */}
          <div className="flex items-start gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-sm text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">IT Support Bot</p>
              <p>
                Hello! I am your AI IT Helpdesk Assistant. What technical issue or question can I help you resolve today?
              </p>
            </div>
          </div>

          {initialPrompt && (
            <div className="flex items-start justify-end gap-3">
              <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm text-xs max-w-md">
                {initialPrompt}
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            disabled
            placeholder="Type your IT issue (e.g., WiFi disconnected, VPN error, Outlook login)..."
            defaultValue={initialPrompt}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-none"
          />
          <button
            type="button"
            disabled
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-2 opacity-70 cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
