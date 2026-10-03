import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import DataTable from '../../components/admin/DataTable';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/orders', { params: { page } });
      setOrders(data.orders);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const columns = [
    { key: '_id', label: 'Order ID', render: (row) => row._id.slice(-8) },
    { key: 'user', label: 'Customer', render: (row) => row.user?.name || row.user?.email || 'N/A' },
    { key: 'totalPrice', label: 'Total', render: (row) => `$${row.totalPrice?.toFixed(2)}` },
    {
      key: 'isPaid',
      label: 'Paid',
      render: (row) => (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.isPaid ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {row.isPaid ? 'Paid' : 'Unpaid'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`border-0 rounded-full px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary ${STATUS_COLORS[row.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={orders}
            renderActions={(row) => (
              <Link to={`/admin/orders/${row._id}`} className="text-primary hover:text-indigo-700 transition">
                <Eye size={16} />
              </Link>
            )}
          />

          {pages > 1 && (
            <div className="flex gap-2 mt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full font-medium text-sm transition ${
                    p === page ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
