import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * @desc    User Dashboard Component
 * @usage   Provides an overview of personal support tickets and request status.
 */
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Terminate user session and redirect to login
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-gray-900 text-white p-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 h-8 w-8 rounded flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-xl font-extrabold tracking-wide">
            Support Desk <span className="text-blue-400">Portal</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right border-r border-gray-700 pr-6 hidden md:block">
            <p className="text-sm font-bold text-white">{user?.name}</p>
            <p className="text-xs text-blue-400 uppercase tracking-widest">{user?.role}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-md text-sm font-bold transition-all active:scale-95 shadow-md"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-8 mt-4">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
          <p className="text-gray-500">Monitor and manage your active technical support requests.</p>
        </header>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Requests</h3>
            <p className="text-4xl font-black text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Pending Review</h3>
            <p className="text-4xl font-black text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Resolved</h3>
            <p className="text-4xl font-black text-green-600">0</p>
          </div>
        </div>

        {/* Dynamic Content Placeholder */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center bg-gray-50/50">
           <p className="text-gray-400 font-medium italic">
             No tickets found. Your support queue is currently empty.
           </p>
           <button 
             className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
           >
             Create New Ticket
           </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;