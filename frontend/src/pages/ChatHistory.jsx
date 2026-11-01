import { Link } from 'react-router-dom';
import { History, MessageSquare, ArrowRight, Calendar } from 'lucide-react';

const mockConversations = [
  {
    id: 1,
    title: 'Windows Defender notification false positive',
    snippet: 'Steps recommended: Add process to safe exclusion list in Windows Security settings.',
    date: 'Today, 11:00 AM',
    messagesCount: 4,
  },
  {
    id: 2,
    title: 'Docker daemon failed to start on Windows 11',
    snippet: 'Resolved by enabling WSL2 feature and restarting the Hyper-V subsystem.',
    date: 'Yesterday, 03:45 PM',
    messagesCount: 8,
  },
  {
    id: 3,
    title: 'DNS resolution issues with corporate proxy',
    snippet: 'Flushed DNS cache via ipconfig /flushdns and verified primary gateway.',
    date: 'Oct 30, 2026',
    messagesCount: 6,
  },
];

export default function ChatHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          AI Chat History
        </h2>
        <p className="text-xs text-slate-500">
          Revisit previous technical consultations and solution transcripts with the AI IT Assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockConversations.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.date}
                </span>
                <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold">
                  <MessageSquare className="w-3 h-3" /> {item.messagesCount} msgs
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {item.snippet}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Session #{item.id}</span>
              <Link
                to="/ai-assistant"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
