import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      {/* Configuration for global notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Placeholder for Dashboard - will be protected in next step */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl">Dashboard Under Construction</div>} />
      </Routes>
    </Router>
  );
}

export default App;