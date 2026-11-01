import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, AlertTriangle } from 'lucide-react';
import TicketStatusBadge from '../components/TicketStatusBadge';
import TicketPriorityBadge from '../components/TicketPriorityBadge';

export default function TicketDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/tickets"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to tickets list
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-slate-400 font-bold">
                TICKET #{id || 101}
              </span>
              <TicketStatusBadge status="In Progress" />
              <TicketPriorityBadge priority="High" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              VPN connection fails with Error 800
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block font-medium">Category:</span>
            <span className="font-semibold text-slate-800">Network & Connectivity</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Reported by:</span>
            <span className="font-semibold text-slate-800">Employee User</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Timestamp:</span>
            <span className="font-semibold text-slate-800">Today, 10:24 AM</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Issue Description
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 p-4 rounded-xl">
            When attempting to connect to the internal VPN client from my Windows 11 workstation,
            it hangs at &quot;Connecting to gateway&quot; and then produces error 800 (Unable to establish the VPN connection).
            Rebooting the laptop did not solve the issue.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900">
            Full dynamic ticket detail queries and status updating will be completed in Phase 4 when SQLite is connected.
          </p>
        </div>
      </div>
    </div>
  );
}
