import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser, clearAuthError } from '../store/slices/authSlice';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Welcome to ShopWithMe, ${result.payload.user.name}!`);
      navigate('/');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-primary rounded-full mb-3">
            <UserPlus size={22} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join ShopWithMe today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-full hover:bg-indigo-700 transition font-medium disabled:bg-gray-300"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
