import { useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match. Please verify.');
    }

    try {
      // Sending only necessary fields to the backend
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      toast.success('Registration successful. You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Join the support desk community today.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
            <input 
              type="text" required
              value={formData.name}
              placeholder="Enter your name"
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
            <input 
              type="email" required
              value={formData.email}
              placeholder="email@example.com"
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
              <input 
                type="password" required
                value={formData.password}
                placeholder="••••••••"
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Confirm</label>
              <input 
                type="password" required
                value={formData.confirmPassword}
                placeholder="••••••••"
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg mt-4"
          >
            Register Now
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-green-600 hover:underline font-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;