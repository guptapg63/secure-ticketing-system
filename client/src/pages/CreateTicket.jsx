import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * @component CreateTicket
 * @description Provides an enterprise-grade interface for users to initiate formal support requests.
 * @requires AuthContext - To provide user session metadata.
 */
const CreateTicket = () => {
  // Synchronized state management for ticket metadata
  const [formData, setFormData] = useState({ subject: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * @function handleSubmit
   * @description Validates and transmits the ticket payload to the support API infrastructure.
   * @param {Event} e - Standard form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.description) {
      toast.error("Required fields are missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      // POST request to the standardized tickets endpoint
      const response = await API.post('/tickets', formData);

      if (response.status === 201 || response.status === 200) {
        toast.success('Service Request Successfully Created');
        navigate('/user-dashboard'); // Authorized redirect to main portal
      }
    } catch (err) {
      console.error('Submission Protocol Error:', err);
      toast.error(err.response?.data?.message || 'Protocol Failure: Unable to synchronize ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-slate-900 text-white p-5 px-10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter uppercase">
            Service <span className="text-blue-500">Infrastructure</span>
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto w-full p-10">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
          <header className="mb-12 border-b border-slate-100 pb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Generate Support Ticket</h2>
            <p className="text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">
              Authorized Client: {user?.name || 'Standard System User'}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Subject Input Field */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">
                Service Subject
              </label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-slate-50/50"
                placeholder="Enter a descriptive summary..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">
                Technical Description
              </label>
              <textarea
                rows="6"
                required
                className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-slate-50/50"
                placeholder="Provide comprehensive technical details regarding the incident..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="flex gap-6 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-[2] ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'} text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-xl`}
              >
                {isSubmitting ? 'Transmitting Data...' : 'Authorize Submission'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/user-dashboard')}
                className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-2xl hover:bg-slate-200 transition-all duration-300 active:scale-95"
              >
                Abort Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;