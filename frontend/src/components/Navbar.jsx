import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LayoutDashboard, LogOut, Menu, X, Store } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            <Store size={26} strokeWidth={2.5} />
            ShopWithMe
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition">
              Home
            </Link>
            <Link to="/cart" className="relative flex items-center gap-1 text-gray-600 hover:text-primary font-medium transition">
              <ShoppingCart size={20} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1 text-gray-600 hover:text-primary font-medium transition">
                    <LayoutDashboard size={18} />
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-1 text-gray-600 hover:text-primary font-medium transition">
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col space-y-3 border-t border-gray-100 pt-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">
              Home
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 font-medium">
              <ShoppingCart size={18} /> Cart ({cartCount})
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 font-medium">
                    <LayoutDashboard size={18} /> Admin
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 font-medium">
                  <User size={18} /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-left text-red-600 font-medium">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
