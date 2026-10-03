import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return null;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/orders" className="text-primary hover:underline text-sm">
        ← Back to Orders
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 my-4">Order #{order._id.slice(-8)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-gray-800 mb-2">Customer</h2>
          <p className="text-sm text-gray-700">{order.user?.name}</p>
          <p className="text-sm text-gray-500">{order.user?.email}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-gray-800 mb-2">Shipping Address</h2>
          <p className="text-sm text-gray-700">
            {order.shippingAddress?.line1}, {order.shippingAddress?.city},{' '}
            {order.shippingAddress?.state} {order.shippingAddress?.zip},{' '}
            {order.shippingAddress?.country}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
        <div className="divide-y">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-3">
              <img
                src={item.image || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image'}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <span className="flex-1 text-sm text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-500">Qty: {item.qty}</span>
              <span className="text-sm font-medium">${item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Items Price</span>
          <span>${order.itemsPrice?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${order.shippingPrice?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${order.taxPrice?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>Total</span>
          <span>${order.totalPrice?.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 pt-2">
          Payment: {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-semibold text-gray-800 mb-3">Order Status</h2>
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

