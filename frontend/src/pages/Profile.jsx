import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h1>
        <p className="text-gray-700">
          <span className="font-medium">Name:</span> {user?.name}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Role:</span> {user?.role}
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Order History</h2>
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Order #{order._id}</span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    statusColor[order.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-2">
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
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-bold text-gray-800">Total: ${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

