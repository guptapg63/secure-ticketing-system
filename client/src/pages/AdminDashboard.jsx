import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

/**
 * @component AdminDashboard
 * @description Master Administrative Interface for global system oversight. 
 * Enables administrators to monitor system metrics and manage ticket lifecycles.
 */
const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * @effect InitialDataSynchronization
   * @description Triggers the fetch of global ticket records upon component mounting.
   */
  useEffect(() => {
    fetchGlobalTickets();
  }, []);

  /**
   * @function fetchGlobalTickets
   * @description Executes an authorized GET request to the administrative endpoint to retrieve all records.
   */
  const fetchGlobalTickets = async () => {
    try {
      // Accessing the specific administrative route for comprehensive data
      const res = await API.get('/tickets/all'); 
      setTickets(res.data);
    } catch (err) {
      toast.error('Data Synchronization Error: Failed to retrieve administrative records.');
      console.error('API_FETCH_ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleStatusUpdate
   * @description Transmits a PUT request to modify the operational status of a specific support incident.
   * @param {string} id - The unique identifier of the ticket record.
   * @param {string} newStatus - The targeted lifecycle status (Open, In-Progress, Resolved, Closed).
   */
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Synchronizing status change with the backend database
      await API.put(`/tickets/${id}`, { status: newStatus }); 
      toast.success(`Record Status Updated: ${newStatus}`);
      
      // Optimistic UI update to maintain interface responsiveness
      setTickets(tickets.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      toast.error('Authorization Denied: Administrative update failed.');
      console.error('API_UPDATE_ERROR:', err);
    }
  };

  /**
   * @function handleLogout
   * @description Destroys the current administrative session and redirects to the login portal.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * @constant systemMetrics
   * @description Derived analytics based on the synchronized ticket state.
   */
  const systemMetrics = {
    totalIncidents: tickets.length,
    activeRequests: tickets.filter(t => t.status === 'Open').length,
    criticalIncidents: tickets.filter(t => t.priority === 'High').length
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Primary Administrative Navigation */}
      <nav className="bg-slate-900 text-white p-5 px-10 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg">A</div>
          <h1 className="text-xl font-black tracking-tighter uppercase">
            Service <span className="text-blue-500">Infrastructure</span>
          </h1>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-lg active:scale-95"
        >
          Terminate Session
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-10">
        <header className="mb-12">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Global Oversight</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Centralized management of cross-departmental technical service requests.</p>
        </header>

        {/* Executive Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 border-l-8 border-l-blue-600">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Volume</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tight">{systemMetrics.totalIncidents}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 border-l-8 border-l-amber-500">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pending Action</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tight">{systemMetrics.activeRequests}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 border-l-8 border-l-red-600">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Critical Priority</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tight">{systemMetrics.criticalIncidents}</p>
          </div>
        </div>

        {/* Global Incident Ledger */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Authorized User</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Incident Subject</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Lifecycle Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <p className="font-black text-slate-300 uppercase tracking-[0.4em] animate-pulse">Synchronizing Global Ledger...</p>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center text-slate-400 italic">No system records available for retrieval.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* User Metadata */}
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        {ticket.user?.name || 'Authorized Client'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        {ticket.user?.email}
                      </p>
                    </td>
                    {/* Incident Details */}
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                        {ticket.subject}
                      </p>
                      <p className="text-[10px] text-blue-600 font-black mt-1 uppercase tracking-widest">
                        Priority Index: {ticket.priority}
                      </p>
                    </td>
                    {/* Lifecycle Badge */}
                    <td className="px-10 py-8 text-center">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                        ticket.status === 'In-Progress' ? 'bg-amber-100 text-amber-700' : 
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    {/* Status Management Controller */}
                    <td className="px-10 py-8 text-right">
                      <select 
                        className="bg-slate-100 border-none rounded-xl text-[10px] font-black uppercase px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm hover:bg-slate-200"
                        value={ticket.status}
                        onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
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
    </div>
  );
};

export default AdminDashboard;