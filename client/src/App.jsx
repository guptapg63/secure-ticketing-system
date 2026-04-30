import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main Application Component
 * Handles global routing and authentication-guarded navigation.
 */
function App() {
  return (
    <Router>
      {/* Global notification provider */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 
          Protected Dashboard Routes 
          Access is restricted to authenticated users via ProtectedRoute.
        */}
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect to login for undefined paths */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;