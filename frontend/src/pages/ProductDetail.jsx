import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, ChevronLeft, Truck, ShieldCheck, RotateCcw, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  const isWishlisted = product ? wishlistItems.some((item) => item._id === product._id) : false;

  const fetchProduct = async () => {
    setError('');
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image',
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        qty,
        stock: product.stock,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to use wishlist');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success(`${product.name} removed from wishlist`);
    } else {
      dispatch(addToWishlist(product._id));
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="w-full h-96 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>;
  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const alreadyReviewed = isAuthenticated && product.reviews?.some((r) => r.user === user?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition">
        <ChevronLeft size={16} /> Back to products
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <img
            src={product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image'}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow hover:bg-white transition"
          >
            <Heart
              size={22}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>
        <div>
          <p className="text-sm text-primary font-medium uppercase tracking-wide mb-1">
            {product.brand} • {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">${displayPrice}</span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">${product.price}</span>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          <p className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-block bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                In Stock — {product.stock} available
              </span>
            ) : (
              <span className="inline-block bg-red-50 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </p>
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="font-medium text-gray-700">Quantity:</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border border-gray-200 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center justify-center gap-2 bg-primary text-white px-10 py-3 rounded-full hover:bg-indigo-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition font-medium"
            >
              <Heart
                size={18}
                className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
              {isWishlisted ? 'Saved' : 'Save'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck size={18} className="text-primary" /> Free shipping over $100
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck size={18} className="text-primary" /> Secure payment
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RotateCcw size={18} className="text-primary" /> 30-day returns
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 gap-8">
          <ReviewForm
            productId={product._id}
            isAuthenticated={isAuthenticated}
            alreadyReviewed={alreadyReviewed}
            onReviewSubmitted={fetchProduct}
          />
          <ReviewList reviews={product.reviews} />
        </div>
      </div>
    </div>
  );
}
