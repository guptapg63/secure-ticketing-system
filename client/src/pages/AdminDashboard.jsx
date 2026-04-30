import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

/**
 * @component AdminDashboard
 * @description Master Administrative Interface with enhanced Priority and Description management.
 */
const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTicket, setViewTicket] = useState(null); // State for the Description Modal
  const navigate = useNavigate();

  useEffect(() => {
    fetchGlobalTickets();
  }, []);

  const fetchGlobalTickets = async () => {
    try {
      const res = await API.get('/tickets/all'); 
      setTickets(res.data);
    } catch (err) {
      toast.error('Data Synchronization Error: Failed to retrieve records.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleAdministrativeUpdate
   * @description Handles updates for both Status and Priority fields.
   */
  const handleAdministrativeUpdate = async (id, updatePayload) => {
    try {
      await API.put(`/tickets/${id}`, updatePayload); 
      toast.success('Administrative Record Successfully Updated');
      
      // Update local state to reflect changes instantly
      setTickets(prev => prev.map(t => t._id === id ? { ...t, ...updatePayload } : t));
    } catch (err) {
      toast.error('Authorization Denied: Update protocol failed.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const systemMetrics = {
    totalIncidents: tickets.length,
    activeRequests: tickets.filter(t => t.status === 'Open').length,
    criticalIncidents: tickets.filter(t => t.priority === 'High').length
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-slate-900 text-white p-5 px-10 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg">A</div>
          <h1 className="text-xl font-black tracking-tighter uppercase">
            Service <span className="text-blue-500">Infrastructure</span>
          </h1>
        </div>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-lg">
          Terminate Session
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-10">
        <header className="mb-12 text-center md:text-left">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Global Oversight</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Centralized management of cross-departmental service requests.</p>
        </header>

        {/* Executive Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-l-blue-600">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Volume</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tight">{systemMetrics.totalIncidents}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-l-amber-500">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pending Action</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tight">{systemMetrics.activeRequests}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-l-red-600">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Critical Priority</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tight">{systemMetrics.criticalIncidents}</p>
          </div>
        </div>

        {/* Main Incident Ledger */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Authorized User</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Incident Details</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Lifecycle Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr><td colSpan="4" className="py-24 text-center font-black text-slate-300 uppercase animate-pulse">Synchronizing...</td></tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{ticket.user?.name || 'Client'}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{ticket.user?.email}</p>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{ticket.subject}</p>
                        {/* Eye Icon Button for Modal */}
                        <button 
                          onClick={() => setViewTicket(ticket)}
                          className="text-blue-500 hover:text-blue-700 transition-all p-1 hover:bg-blue-50 rounded-lg"
                          title="View Description"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                      {/* Priority Update Dropdown */}
                      <select 
                        className="mt-2 bg-transparent border-none text-[10px] font-black uppercase text-blue-600 outline-none cursor-pointer focus:ring-0"
                        value={ticket.priority}
                        onChange={(e) => handleAdministrativeUpdate(ticket._id, { priority: e.target.value })}
                      >
                        <option value="Low">Priority: Low</option>
                        <option value="Medium">Priority: Medium</option>
                        <option value="High">Priority: High</option>
                      </select>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                        ticket.status === 'In-Progress' ? 'bg-amber-100 text-amber-700' : 
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <select 
                        className="bg-slate-100 border-none rounded-xl text-[10px] font-black uppercase px-4 py-3 outline-none hover:bg-slate-200 transition-all cursor-pointer"
                        value={ticket.status}
                        onChange={(e) => handleAdministrativeUpdate(ticket._id, { status: e.target.value })}
                      >
                        <option value="Open">Set Open</option>
                        <option value="In-Progress">Set In-Progress</option>
                        <option value="Resolved">Set Resolved</option>
                        <option value="Closed">Set Closed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Description Modal Overlay */}
      {viewTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white max-w-2xl w-full rounded-[2.5rem] p-10 shadow-2xl transform transition-all">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{viewTicket.subject}</h2>
              <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-slate-500">
                UID: {viewTicket._id.slice(-6).toUpperCase()}
              </span>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
              <p className="text-slate-600 font-medium leading-relaxed">{viewTicket.description}</p>
            </div>
            <button 
              onClick={() => setViewTicket(null)}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
            >
              Terminate View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;