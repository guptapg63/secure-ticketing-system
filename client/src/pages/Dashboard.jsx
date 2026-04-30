import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

/**
 * @component Dashboard
 * @description Centralized administrative portal for users to manage the lifecycle of their technical support tickets.
 * @version 1.1.0
 */
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * @effect InitialDataFetch
   * @description Synchronizes the component state with the backend service records upon mounting.
   */
  useEffect(() => {
    fetchTickets();
  }, []);

  /**
   * @function fetchTickets
   * @description Retrieves all service requests associated with the authenticated user session.
   */
  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      toast.error('Synchronization Error: Unable to retrieve portfolio records.');
      console.error('Fetch Protocol Failure:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleDelete
   * @description Executes the DELETE protocol to remove a specific record from the database.
   * @param {string} id - The unique identifier (UUID) of the ticket to be terminated.
   */
  const handleDelete = async (id) => {
    // Security Confirmation Prompt
    if (!window.confirm("CONFIRMATION REQUIRED: Are you sure you want to permanently terminate this service record?")) return;

    try {
      await API.delete(`/tickets/${id}`);
      toast.success('Record Successfully Terminated');
      
      // Real-time state update to reflect changes without page refresh
      setTickets(tickets.filter(ticket => ticket._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Authorization Denied: Resource protection active.';
      toast.error(errorMsg);
      console.error('Termination Protocol Error:', err);
    }
  };

  /**
   * @function handleLogout
   * @description Terminates the current user session and clears authentication metadata.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Primary Navigation System */}
      <nav className="bg-slate-900 text-white p-5 px-10 flex justify-between items-center shadow-2xl">
        <h1 className="text-xl font-black tracking-tighter uppercase">
          Service <span className="text-blue-500">Infrastructure</span>
        </h1>
        <div className="flex items-center gap-8">
          <div className="hidden md:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Authorized Session</p>
            <p className="text-sm font-black text-white">{user?.name}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-lg active:scale-95"
          >
            Terminate Session
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10">
        <header className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Support Portfolio</h2>
            <p className="text-slate-500 font-medium mt-3 text-lg">Manage and track the lifecycle of active technical requests.</p>
          </div>
          <button 
            onClick={() => navigate('/create-ticket')}
            className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
          >
            + Initiate New Ticket
          </button>
        </header>

        {loading ? (
          <div className="py-32 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-slate-400 font-bold uppercase tracking-[0.3em] animate-pulse">Syncing Records...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-32 text-center">
            <p className="text-slate-400 font-medium italic text-lg">No active service records detected in this profile.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-left">Service Incident</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Protocol Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-800 tracking-tight uppercase">{ticket.subject}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">UID: {ticket._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                        ticket.status === 'In-Progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => handleDelete(ticket._id)}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-100 active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;