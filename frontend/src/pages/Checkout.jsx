import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { clearCart } from '../store/slices/cartSlice';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
function CheckoutForm() {
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderPlaced]);
  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { data: intentData } = await api.post('/payments/create-payment-intent', {
        amount: Math.round(totalPrice * 100),
      });
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: user?.name, email: user?.email },
          },
        }
      );
      if (stripeError) {
        toast.error(stripeError.message);
        setProcessing(false);
        return;
      }
      if (paymentIntent.status === 'succeeded') {
        setOrderPlaced(true);
        const orderItems = cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        }));
        const { data: orderData } = await api.post('/orders', {
          items: orderItems,
          shippingAddress,
          paymentMethod: 'stripe',
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        });
        await api.put(`/orders/${orderData.order._id}/pay`, {
          id: paymentIntent.id,
          status: paymentIntent.status,
          email: user?.email,
        });
        dispatch(clearCart());
        toast.success('Payment successful! Order placed.');
        navigate('/profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-primary" /> Shipping Address
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="line1"
            placeholder="Address Line"
            value={shippingAddress.line1}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingAddress.city}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingAddress.state}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            value={shippingAddress.zip}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingAddress.country}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CreditCard size={18} className="text-primary" /> Payment Details
        </h2>
        <div className="border border-gray-200 rounded-xl px-4 py-3.5">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Test card: 4242 4242 4242 4242, any future date, any CVC</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-5 space-y-1.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items</span>
          <span>${itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>${shippingPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>${taxPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2 text-gray-800">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-primary text-white py-3.5 rounded-full hover:bg-indigo-700 transition font-medium disabled:bg-gray-300"
      >
        {processing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
}
export default function Checkout() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
