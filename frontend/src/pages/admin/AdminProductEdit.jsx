import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const emptyForm = {
  name: '',
  description: '',
  brand: '',
  category: '',
  price: '',
  discountPrice: '',
  stock: '',
  images: '',
  featured: false,
};

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name || '',
          description: p.description || '',
          brand: p.brand || '',
          category: p.category || '',
          price: p.price ?? '',
          discountPrice: p.discountPrice ?? '',
          stock: p.stock ?? '',
          images: (p.images || []).join(', '),
          featured: p.featured || false,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      stock: Number(form.stock),
      images: form.images.split(',').map((url) => url.trim()).filter(Boolean),
      featured: form.featured,
    };

    try {
      if (isNew) {
        await api.post('/products', payload);
      } else {
        await api.put(`/products/${id}`, payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Add Product' : 'Edit Product'}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={form.discountPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URLs (comma separated)
          </label>
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            id="featured"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Featured Product
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}

