import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, DollarSign, ArrowRight, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchDashboardStats } from '../../store/slices/adminSlice';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders, lowStockProducts, monthlySales, loading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const chartData = (monthlySales || []).map((m) => ({
    month: m.month || m._id,
    sales: m.totalSales || m.total || m.sales || 0,
  }));

  const orderColumns = [
    { key: '_id', label: 'Order ID', render: (row) => row._id.slice(-8) },
    { key: 'user', label: 'Customer', render: (row) => row.user?.name || 'N/A' },
    { key: 'totalPrice', label: 'Total', render: (row) => `$${row.totalPrice?.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-primary capitalize">
          {row.status}
        </span>
      ),
    },
  ];

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<Users size={22} />} color="bg-indigo-600" />
        <StatsCard title="Total Products" value={stats?.totalProducts ?? 0} icon={<Package size={22} />} color="bg-emerald-600" />
        <StatsCard title="Total Orders" value={stats?.totalOrders ?? 0} icon={<ShoppingBag size={22} />} color="bg-amber-600" />
        <StatsCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`}
          icon={<DollarSign size={22} />}
          color="bg-rose-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales</h2>
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(value) => [`$${value}`, 'Sales']}
              />
              <Bar dataKey="sales" fill="#4F46E5" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No sales data available yet.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <DataTable columns={orderColumns} data={recentOrders || []} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Products</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {lowStockProducts?.length ? (
              lowStockProducts.map((p) => (
                <div key={p._id} className="flex justify-between items-center px-5 py-3.5">
                  <span className="text-sm text-gray-700">{p.name}</span>
                  <span className="flex items-center gap-1 text-xs font-medium bg-red-50 text-red-600 px-3 py-1 rounded-full">
                    <AlertTriangle size={12} /> {p.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm px-5 py-3.5">All products well stocked.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/admin/products" className="text-primary font-medium hover:underline flex items-center gap-1">
          Manage Products <ArrowRight size={14} />
        </Link>
        <Link to="/admin/orders" className="text-primary font-medium hover:underline flex items-center gap-1">
          Manage Orders <ArrowRight size={14} />
        </Link>
        <Link to="/admin/users" className="text-primary font-medium hover:underline flex items-center gap-1">
          Manage Users <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
