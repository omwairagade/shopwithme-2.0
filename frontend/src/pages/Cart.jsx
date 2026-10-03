import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateCartQty, removeFromCart } from '../store/slices/cartSlice';

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.product));
    toast.success(`${item.name} removed from cart`);
  };

  const changeQty = (item, delta) => {
    const newQty = item.qty + delta;
    if (newQty < 1 || newQty > (item.stock || 10)) return;
    dispatch(updateCartQty({ product: item.product, qty: newQty }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {cartItems.map((item) => (
          <div key={item.product} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-primary font-bold">${item.price}</p>
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 w-fit">
              <button
                onClick={() => changeQty(item, -1)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-medium">{item.qty}</span>
              <button
                onClick={() => changeQty(item, 1)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition"
              >
                <Plus size={14} />
              </button>
            </div>

            <p className="w-20 text-right font-semibold text-gray-800">
              ${(item.price * item.qty).toFixed(2)}
            </p>

            <button
              onClick={() => handleRemove(item)}
              className="text-red-500 hover:text-red-700 transition p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xl font-bold text-gray-800">Total: ${total.toFixed(2)}</span>
        <button
          onClick={handleCheckout}
          className="w-full sm:w-auto bg-primary text-white px-10 py-3 rounded-full hover:bg-indigo-700 transition font-medium"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
