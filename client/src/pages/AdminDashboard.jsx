import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * @desc    Admin Dashboard Component
 * @usage   Centralized oversight for managing system operations and global support tickets.
 */
const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Terminate admin session and redirect to login
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
            A
          </div>
          <h1 className="text-xl font-extrabold tracking-wide">
            Support Desk <span className="text-blue-400">Admin</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right border-r border-gray-700 pr-6 hidden md:block">
            <p className="text-sm font-bold text-white">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-blue-400 uppercase tracking-widest">System Admin</p>
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
      <div className="max-w-7xl mx-auto p-8 mt-4">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Admin Control Panel</h2>
          <p className="text-gray-500">Global oversight for support tickets and system-wide activity.</p>
        </header>
          
        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Total System Tickets</h3>
            <p className="text-4xl font-black text-gray-900">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <h3 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Active System Users</h3>
            <p className="text-4xl font-black text-gray-900">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
            <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Pending Oversight</h3>
            <p className="text-4xl font-black text-gray-900">0</p>
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center bg-gray-50/50">
          <p className="text-gray-500 font-medium italic">
            No administrative actions required. System status is currently optimal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;