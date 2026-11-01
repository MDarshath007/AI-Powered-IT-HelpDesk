import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bot,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Wifi,
  Laptop,
  HelpCircle,
  FileText,
} from 'lucide-react';
import TicketStatusBadge from '../components/TicketStatusBadge';
import TicketPriorityBadge from '../components/TicketPriorityBadge';

// Initial realistic mock data for Phase 1 preview
const initialTickets = [
  {
    id: 101,
    title: 'VPN connection fails with Error 800',
    category: 'Network',
    priority: 'High',
    status: 'In Progress',
    createdAt: 'Today, 10:24 AM',
  },
  {
    id: 102,
    title: 'Outlook asks for password repeatedly',
    category: 'Software',
    priority: 'Medium',
    status: 'Open',
    createdAt: 'Today, 09:15 AM',
  },
  {
    id: 103,
    title: 'Request second monitor display adapter',
    category: 'Hardware',
    priority: 'Low',
    status: 'Resolved',
    createdAt: 'Yesterday, 04:30 PM',
  },
  {
    id: 104,
    title: 'Windows 11 update stuck at 74%',
    category: 'Windows',
    priority: 'High',
    status: 'Open',
    createdAt: 'Yesterday, 02:10 PM',
  },
  {
    id: 105,
    title: 'Slack notifications not arriving on desktop',
    category: 'Software',
    priority: 'Low',
    status: 'Resolved',
    createdAt: 'Oct 30, 2026',
  },
];

const quickTroubleshooting = [
  {
    icon: Wifi,
    title: 'Network & VPN Issues',
    query: 'My corporate VPN connects but cannot access intranet portals.',
  },
  {
    icon: Laptop,
    title: 'Windows Crash / Updates',
    query: 'Windows 11 update loop troubleshooting steps.',
  },
  {
    icon: HelpCircle,
    title: 'Software & Email Config',
    query: 'How to clear Microsoft Outlook credential cache on Windows?',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [tickets] = useState(initialTickets);

  // Compute metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const handleQuickPrompt = (prompt) => {
    navigate('/ai-assistant', { state: { initialPrompt: prompt } });
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI-Powered IT Support
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome to the IT Helpdesk Portal
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Need immediate troubleshooting? Chat directly with our Gemini-powered IT
            Assistant or submit a support ticket to our technical operations team.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-colors"
            >
              <Bot className="w-4 h-4" />
              Launch AI Assistant
            </Link>
            <Link
              to="/tickets"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              New Support Ticket
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Tickets
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</p>
            <span className="text-[11px] text-slate-400 font-medium">All logged requests</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Open Tickets
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-600">{openCount}</p>
            <span className="text-[11px] text-amber-600/80 font-medium">Awaiting response</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              In Progress
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{inProgressCount}</p>
            <span className="text-[11px] text-blue-600/80 font-medium">Being investigated</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Resolved
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{resolvedCount}</p>
            <span className="text-[11px] text-emerald-600/80 font-medium">Successfully closed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Quick Access to AI Assistant & Help Topics */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-2xl border border-indigo-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Quick AI Support Assistance
              </h3>
              <p className="text-xs text-slate-600">
                Click any common IT issue to start troubleshooting with the AI Assistant
              </p>
            </div>
          </div>
          <Link
            to="/ai-assistant"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Open full chat <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickTroubleshooting.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPrompt(item.query)}
              className="group text-left p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-800">
                  {item.title}
                </h4>
              </div>
              <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed">
                "{item.query}"
              </p>
              <span className="mt-3 text-[11px] font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                Ask AI <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Recent Support Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Support Tickets
            </h3>
            <p className="text-xs text-slate-500">
              Overview of recently submitted employee technical assistance tickets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/tickets"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              View All Tickets
            </Link>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-6">Ticket ID</th>
                <th className="py-3 px-6">Subject / Title</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Created</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-6 font-mono text-slate-500 font-medium">
                    #{t.id}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {t.title}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 font-medium">
                    {t.category}
                  </td>
                  <td className="py-3.5 px-6">
                    <TicketPriorityBadge priority={t.priority} />
                  </td>
                  <td className="py-3.5 px-6">
                    <TicketStatusBadge status={t.status} />
                  </td>
                  <td className="py-3.5 px-6 text-slate-400 whitespace-nowrap">
                    {t.createdAt}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
