import { Link } from 'react-router-dom';
import { Store, Share2, MessageCircle, Send, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
            <Store size={22} />
            ShopWithMe
          </div>
          <p className="text-sm text-gray-400">
            Your one-stop shop for electronics, fashion, home goods, and more — delivered fast,
            priced right.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
            <li><Link to="/profile" className="hover:text-white transition">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Stay Connected</h3>
          <div className="flex gap-4 mb-3">
            <a href="#" className="hover:text-white transition"><Share2 size={20} /></a>
            <a href="#" className="hover:text-white transition"><MessageCircle size={20} /></a>
            <a href="#" className="hover:text-white transition"><Send size={20} /></a>
            <a href="#" className="hover:text-white transition"><Mail size={20} /></a>
          </div>
          <p className="text-xs text-gray-500">Subscribe to our newsletter for deals & updates.</p>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ShopWithMe. All rights reserved.
      </div>
    </footer>
  );
}
