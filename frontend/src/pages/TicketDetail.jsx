import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Tag,
  AlertCircle,
  Loader2,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import TicketStatusBadge from '../components/TicketStatusBadge';
import TicketPriorityBadge from '../components/TicketPriorityBadge';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { ticketService, formatTicketDate } from '../services/ticketService';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status updating state
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch ticket details
  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      setError(err.message || `Unable to load ticket #${id}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (!ticket || ticket.status === newStatus) return;

    try {
      setStatusUpdating(true);
      setUpdateSuccess(false);
      const updated = await ticketService.updateTicketStatus(ticket.id, newStatus);
      setTicket(updated);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update ticket status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle ticket deletion
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await ticketService.deleteTicket(ticket.id);
      setIsDeleteOpen(false);
      navigate('/tickets');
    } catch (err) {
      alert(err.message || 'Failed to delete ticket.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tickets list
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-xs">Loading ticket #{id} from SQLite...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tickets list
        </Link>
        <div className="bg-white rounded-2xl border border-rose-200 p-8 space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <h3 className="font-bold text-sm">Ticket Not Found or Error Occurred</h3>
          </div>
          <p className="text-xs text-slate-600">{error || `Ticket #${id} could not be found in the database.`}</p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={fetchTicket}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Retry
            </button>
            <Link
              to="/tickets"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Return to Tickets List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tickets list
        </Link>

        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Ticket
        </button>
      </div>

      {/* Main Ticket Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-slate-400 font-bold">
                TICKET #{ticket.id}
              </span>
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {ticket.title}
            </h2>
          </div>

          {/* Status Updater Control */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Change Status:
            </label>
            <div className="flex items-center gap-2">
              <select
                disabled={statusUpdating}
                value={ticket.status.toLowerCase()}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              {statusUpdating && (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              )}
              {updateSuccess && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block font-medium mb-0.5">Category:</span>
            <span className="font-semibold text-slate-800">{ticket.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium mb-0.5">Priority:</span>
            <span className="font-semibold text-slate-800 capitalize">{ticket.priority}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium mb-0.5">Created At:</span>
            <span className="font-semibold text-slate-800">
              {formatTicketDate(ticket.created_at)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium mb-0.5">Last Updated:</span>
            <span className="font-semibold text-slate-800">
              {formatTicketDate(ticket.updated_at)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Issue Description
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 p-4 rounded-xl whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        ticketId={ticket.id}
        ticketTitle={ticket.title}
        loading={deleteLoading}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
