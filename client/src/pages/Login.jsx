import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Role-based redirection logic
      if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/user-dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/login', formData);

      // Normalizing the response from a flat backend object
      const rawRole = res.data.role || res.data.user?.role || 'user';
      
      const responseData = {
        token: res.data.token,
        user: {
          _id: res.data._id || res.data.id,
          name: res.data.name,
          email: res.data.email,
          role: String(rawRole).toLowerCase() // Fixes case-sensitivity issues
        }
      };

      login(responseData);
      toast.success('Authentication successful');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-200">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Support Desk Portal
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              placeholder="Enter email"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              placeholder="Enter password"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg hover:bg-blue-700 transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 border-t pt-6">
          New here?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;