import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import ChatHistory from './pages/ChatHistory';

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path === '/') return 'IT Helpdesk Dashboard';
    if (path.startsWith('/ai-assistant')) return 'AI Technical Assistant';
    if (path === '/tickets') return 'Support Tickets';
    if (path.startsWith('/tickets/')) return 'Ticket Details';
    if (path.startsWith('/history')) return 'Chat Transcripts & History';
    return 'Helpdesk Portal';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setMobileOpen(true)}
          title={getPageTitle(location.pathname)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Tailwind CSS Verification Banner */}
          {/* <div className="bg-red-500 text-white p-4 rounded-lg mb-6 font-semibold shadow-sm flex items-center justify-between">
            <span>Tailwind CSS is active! (Classes tested: bg-red-500, text-white, p-4)</span>
            <span className="text-xs bg-red-600 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">Verified</span>
          </div> */}

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/history" element={<ChatHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
