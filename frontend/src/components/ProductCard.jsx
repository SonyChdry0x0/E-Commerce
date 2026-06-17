import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import AuthModal from './AuthModal';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth?.user);
  const [wishlisted, setWishlisted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const rawImage = product.images?.[0] || product.image || product.img;
  const imageSrc = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${BACKEND_URL}/${rawImage.replace(/^\//, '')}`
    : "https://placehold.co/600x800/f4f4f5/a1a1aa?text=No+Image";

  const requireAuth = (action) => {
    if (isLoggedIn) {
      action();
    } else {
      setPendingAction(() => action);
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleWishlist = () => {
    requireAuth(() => {
      dispatch(addToCart({ ...product, qty: 1 }));
      setWishlisted(true);
    });
  };

  return (
    <>
      <AuthModal
        isOpen={showAuth}
        onClose={() => { setShowAuth(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
      />

      <div className="group flex flex-col max-h-[450px] max-w-[250px] mx-auto w-full" style={{ color: 'var(--text-primary)' }}>

       
<Link
  to={`/product/${product._id}`}
  className="relative block bg-gray-50"
>
  <div className="aspect-[4/5] flex items-center justify-center overflow-hidden min-h-[160px]">
    <img
      src={imageSrc}
      alt={product.name}
      className="max-w-full max-h-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src =
          "https://placehold.co/600x800/f4f4f5/a1a1aa?text=No+Image";
      }}
    />
  </div>

  {/* NEW badge */}
  {product.isNew && (
    <span
      className="absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{ background: 'var(--text-primary)' }}
    >
      NEW
    </span>
  )}

  {/* Heart button */}
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      handleWishlist();
    }}
    className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
    style={{ background: 'white' }}
  >
    <span className="text-base">{wishlisted ? "❤️" : "🤍"}</span>
  </button>
</Link>

        {/* CONTENT */}
        <div className="pt-3 pb-1 px-0.5">

          {product.brand && (
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {product.brand}
            </p>
          )}

          <Link to={`/product/${product._id}`}>
            <h3
              className="text-sm font-semibold line-clamp-1 mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {product.name}
            </h3>
          </Link>

          {product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-2">
              {product.sizes.slice(0, 4).map((s) => (
                <span key={s} className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  {s}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}

          <p className="text-base font-bold" style={{ color: '#b89d86' }}>
            ${product.price}
          </p>
        </div>
      </div>
    </>
  );
}