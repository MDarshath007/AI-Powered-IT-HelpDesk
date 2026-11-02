import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  PlusCircle,
  Filter,
  RefreshCw,
  AlertCircle,
  Loader2,
  Trash2,
  Search,
  ExternalLink,
} from 'lucide-react';
import TicketStatusBadge from '../components/TicketStatusBadge';
import TicketPriorityBadge from '../components/TicketPriorityBadge';
import CreateTicketModal from '../components/CreateTicketModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { ticketService, formatTicketDate } from '../services/ticketService';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch tickets from Express backend
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle new ticket created
  const handleTicketCreated = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  // Handle delete ticket
  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    try {
      setDeleteLoading(true);
      await ticketService.deleteTicket(ticketToDelete.id);
      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));
      setTicketToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete ticket.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      t.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === 'all' ||
      t.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Support Tickets
          </h2>
          <p className="text-xs text-slate-500">
            Submit new issues or review current tickets stored in SQLite.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchTickets}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors disabled:opacity-60"
            title="Refresh tickets from SQLite"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchTickets}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg self-start sm:self-auto transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, description, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <span>Priority:</span>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
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
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    <span>Loading tickets from SQLite database...</span>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-slate-800">No tickets found</p>
                      <p className="text-[11px] text-slate-400">
                        {tickets.length === 0
                          ? 'No tickets exist in SQLite yet. Click "Create Ticket" to submit your first issue.'
                          : 'No tickets matched your filter criteria. Try resetting filters.'}
                      </p>
                      {tickets.length === 0 && (
                        <button
                          type="button"
                          onClick={() => setIsCreateOpen(true)}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Create First Ticket
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-500 font-medium">
                      #{t.id}
                    </td>
                    <td className="py-3.5 px-6 max-w-xs">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors block"
                      >
                        {t.title}
                      </Link>
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
                      {formatTicketDate(t.created_at)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-3">
                        <Link
                          to={`/tickets/${t.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTicketToDelete(t)}
                          title="Delete Ticket"
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(ticketToDelete)}
        ticketId={ticketToDelete?.id}
        ticketTitle={ticketToDelete?.title}
        loading={deleteLoading}
        onClose={() => setTicketToDelete(null)}
        onConfirm={handleDeleteTicket}
      />
    </div>
  );
}
