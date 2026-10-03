import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '../store/slices/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image',
        price: displayPrice,
        qty: 1,
        stock: product.stock,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image'}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -{discountPercent}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            Featured
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-primary transition">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.numReviews})</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">${displayPrice}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">${product.price}</span>
          )}
        </div>

        <div className="mt-auto">
          {product.stock === 0 ? (
            <span className="block text-center text-red-500 text-sm font-medium py-2">
              Out of Stock
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-full hover:bg-indigo-700 transition font-medium text-sm"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
