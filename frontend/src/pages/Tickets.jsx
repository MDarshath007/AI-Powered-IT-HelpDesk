import { Link } from 'react-router-dom';
import { Ticket, PlusCircle, Filter } from 'lucide-react';
import TicketStatusBadge from '../components/TicketStatusBadge';
import TicketPriorityBadge from '../components/TicketPriorityBadge';

const mockTickets = [
  {
    id: 101,
    title: 'VPN connection fails with Error 800',
    category: 'Network',
    priority: 'High',
    status: 'In Progress',
    createdAt: 'Today, 10:24 AM',
    description: 'Cannot connect to company internal gateway when working remotely.',
  },
  {
    id: 102,
    title: 'Outlook asks for password repeatedly',
    category: 'Software',
    priority: 'Medium',
    status: 'Open',
    createdAt: 'Today, 09:15 AM',
    description: 'Modern auth pop-up dismisses immediately.',
  },
  {
    id: 103,
    title: 'Request second monitor display adapter',
    category: 'Hardware',
    priority: 'Low',
    status: 'Resolved',
    createdAt: 'Yesterday, 04:30 PM',
    description: 'Need USB-C to HDMI adapter for dual monitors.',
  },
  {
    id: 104,
    title: 'Windows 11 update stuck at 74%',
    category: 'Windows',
    priority: 'High',
    status: 'Open',
    createdAt: 'Yesterday, 02:10 PM',
    description: 'Restarted twice but the installation freezes at the same percentage.',
  },
];

export default function Tickets() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Support Tickets
          </h2>
          <p className="text-xs text-slate-500">
            Submit new issues or review current tickets being resolved by technical support.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Ticket creation will be wired to SQLite in Phase 4.')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create Ticket
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Title & Summary</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Created</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-slate-500 font-medium">
                    #{t.id}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-slate-900">{t.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {t.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{t.category}</td>
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
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Details
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
