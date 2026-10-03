import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Toys', 'Beauty', 'Sports'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page, sort };
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setPages(data.pages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, sort, page]);

  return (
    <div>
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium mb-4">
            <Sparkles size={16} />
            New Season Arrivals
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 max-w-2xl leading-tight">
            Shop Smarter. Live Better.
          </h1>
          <p className="text-indigo-100 text-lg max-w-xl mb-8">
            Discover curated electronics, fashion, home essentials and more — all in one place,
            at prices you'll love.
          </p>
          <a
            href="#products"
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition shadow-lg"
          >
            Shop Now
          </a>
        </div>
      </div>

      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Our Collection</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full border border-gray-200 bg-white rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 bg-white rounded-full px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="relative">
              <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-200 bg-white rounded-full pl-10 pr-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-52 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded-full mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-12">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full font-medium transition ${
                      p === page ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-primary'
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
    </div>
  );
}
