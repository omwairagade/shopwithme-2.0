import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import DataTable from '../../components/admin/DataTable';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page };
      if (search) params.search = search;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.images?.[0] || 'https://placehold.co/100x100'} alt={row.name} className="w-10 h-10 object-cover rounded-lg" />
          <span className="font-medium text-gray-700">{row.name}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (row) => `$${row.price}` },
    {
      key: 'stock',
      label: 'Stock',
      render: (row) => (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {row.stock}
        </span>
      ),
    },
    { key: 'sold', label: 'Sold' },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition font-medium text-sm"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="relative max-w-md mb-5">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border border-gray-200 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={products}
            renderActions={(row) => (
              <div className="flex gap-3">
                <Link to={`/admin/products/${row._id}`} className="text-primary hover:text-indigo-700 transition">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => handleDelete(row._id, row.name)} className="text-red-500 hover:text-red-700 transition">
                  <Trash2 size={16} />
                </button>
              </div>
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
