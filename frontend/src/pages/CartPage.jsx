import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQty } from '../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector as useReduxSelector } from 'react-redux';
import AuthModal from '../components/AuthModal';

const BACKEND_URL = "http://localhost:8080";

// ─── Checkbox ─────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, indeterminate = false }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div
        onClick={onChange}
        className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0"
        style={{
          borderColor: checked || indeterminate ? '#b89d86' : '#ddd6cc',
          background:  checked || indeterminate ? '#b89d86' : '#fff',
        }}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {indeterminate && !checked && (
          <div className="w-2 h-0.5 bg-white rounded" />
        )}
      </div>
    </label>
  );
}

// ─── Quantity stepper ─────────────────────────────────────────────────────────
function QtyStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded border border-[#ddd6cc]">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center text-[#8a7a6a] hover:text-[#1a1a1a] hover:bg-[#f7f3ee] transition-colors text-lg leading-none"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums text-[#1a1a1a] border-x border-[#ddd6cc]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center text-[#8a7a6a] hover:text-[#1a1a1a] hover:bg-[#f7f3ee] transition-colors text-lg leading-none"
      >
        +
      </button>
    </div>
  );
}

// ─── Single cart row ──────────────────────────────────────────────────────────
function CartItem({ item, selected, onSelect, onRemove, onQtyChange }) {
  const rawImage = item.images?.[0] || item.image;
  const imageSrc = rawImage
    ? rawImage.startsWith('http') ? rawImage : `${BACKEND_URL}/${rawImage.replace(/^\//, '')}`
    : 'https://placehold.co/80x100/f0ebe3/8a7a6a?text=No+img';

  const originalPrice = item.originalPrice || item.price * 1.15;

  return (
    <div className="flex items-start gap-3 py-4 border-b border-[#ede7de] last:border-b-0">
      <div className="pt-1 shrink-0">
        <Checkbox checked={selected} onChange={onSelect} />
      </div>

      <Link to={`/product/${item._id}`} className="shrink-0">
        <div className="w-20 h-24 rounded overflow-hidden border border-[#ede7de] bg-[#f0ebe3]">
          <img
            src={imageSrc}
            alt={item.name}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x100/f0ebe3/8a7a6a?text=Error'; }}
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item._id}`}
          className="text-sm text-[#1a1a1a] hover:text-[#8a7a6a] transition-colors leading-snug line-clamp-2 block mb-1"
        >
          {item.brand && <span className="text-[#8a7a6a]">{item.brand} </span>}
          {item.name}
        </Link>

        {item.selectedSize && (
          <span className="inline-block text-xs text-[#8a7a6a] bg-[#f7f3ee] border border-[#ede7de] rounded px-2 py-0.5 mb-2">
            Size: {item.selectedSize}
          </span>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-[#1a1a1a]">
            Rs. {(item.price).toFixed(0)}
          </span>
          <span className="text-xs text-[#8a7a6a] line-through">
            Rs. {originalPrice.toFixed(0)}
          </span>
          <span className="text-xs text-[#8B6F52] font-medium">
            -{Math.round(((originalPrice - item.price) / originalPrice) * 100)}%
          </span>
        </div>

        {item.endsAt && (
          <p className="text-xs text-[#8a7a6a] mb-2">Ends at {item.endsAt}</p>
        )}

        <div className="flex items-center justify-between">
          <QtyStepper value={item.qty} onChange={onQtyChange} />
          <div className="flex items-center gap-3">
            <button type="button" className="text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-[#8a7a6a] hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Seller group ─────────────────────────────────────────────────────────────
function SellerGroup({ seller, items, selectedIds, onToggleSeller, onToggleItem, onRemove, onQtyChange }) {
  const sellerItemIds = items.map(i => `${i._id}-${i.selectedSize}`);
  const sellerSelected = sellerItemIds.every(id => selectedIds.has(id));
  const sellerPartial  = sellerItemIds.some(id => selectedIds.has(id)) && !sellerSelected;

  return (
    <div className="bg-white rounded border border-[#ede7de] mb-3 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#ede7de] bg-[#f7f3ee]">
        <Checkbox
          checked={sellerSelected}
          indeterminate={sellerPartial}
          onChange={() => onToggleSeller(sellerItemIds, sellerSelected)}
        />
        <svg className="w-4 h-4 text-[#8a7a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
        <span className="text-sm font-semibold text-[#1a1a1a]">{seller}</span>
        <svg className="w-3.5 h-3.5 text-[#8a7a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="px-4">
        <AnimatePresence>
          {items.map(item => {
            const itemKey = `${item._id}-${item.selectedSize}`;
            return (
              <motion.div
                key={itemKey}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CartItem
                  item={item}
                  selected={selectedIds.has(itemKey)}
                  onSelect={() => onToggleItem(itemKey)}
                  onRemove={() => onRemove(item._id)}
                  onQtyChange={qty => onQtyChange(item._id, qty)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { items } = useSelector(state => state.cart);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  // ── Same auth pattern as HomePage ─────────────────────────────────────────
  const isLoggedIn = useReduxSelector((state) => !!state.auth?.user);
  const [showAuth, setShowAuth]           = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

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
  // ──────────────────────────────────────────────────────────────────────────

  const [checkingOut, setCheckingOut]       = useState(false);
  const [selectedIds, setSelectedIds]       = useState(new Set());
  const [voucher, setVoucher]               = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherError, setVoucherError]     = useState('');

  const grouped = useMemo(() => {
    return items.reduce((acc, item) => {
      const seller = item.brand || item.seller || 'Other Seller';
      if (!acc[seller]) acc[seller] = [];
      acc[seller].push(item);
      return acc;
    }, {});
  }, [items]);

  const allItemKeys  = items.map(i => `${i._id}-${i.selectedSize}`);
  const allSelected  = allItemKeys.length > 0 && allItemKeys.every(k => selectedIds.has(k));
  const someSelected = allItemKeys.some(k => selectedIds.has(k));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else             setSelectedIds(new Set(allItemKeys));
  };

  const toggleItem = (key) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleSeller = (keys, wasSelected) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (wasSelected) keys.forEach(k => next.delete(k));
      else             keys.forEach(k => next.add(k));
      return next;
    });
  };

  const selectedItems = items.filter(i => selectedIds.has(`${i._id}-${i.selectedSize}`));
  const subtotal = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = voucherApplied ? subtotal * 0.2 : 0;
  const shipping = subtotal > 0 && subtotal >= 50 ? 0 : (subtotal > 0 ? 7.99 : 0);
  const total    = subtotal - discount + shipping;

  const handleApplyVoucher = () => {
    if (voucher.trim().toUpperCase() === 'DRIP20') {
      setVoucherApplied(true);
      setVoucherError('');
    } else {
      setVoucherError('Invalid or expired voucher code.');
      setVoucherApplied(false);
    }
  };

  // ── Checkout is now guarded ───────────────────────────────────────────────
  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    requireAuth(() => {
      navigate('/checkout');
    });
  };

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-xs">
          <div className="w-24 h-24 rounded-full bg-[#f0ebe3] flex items-center justify-center mx-auto mb-6 border-2 border-[#ede7de]">
            <svg className="w-10 h-10 text-[#8a7a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Your cart is empty</h2>
          <p className="text-sm text-[#8a7a6a] leading-relaxed mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-lg text-sm font-bold text-white bg-[#b89d86] hover:bg-[#a88c75] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Auth modal — same as HomePage */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => { setShowAuth(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
      />

      <div className="min-h-screen bg-[#f7f4ef]">
        <main className="max-w-6xl mx-auto px-4 py-12">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link to="/shop" className="text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <nav className="flex items-center gap-1.5 text-xs text-[#8a7a6a]">
              <Link to="/" className="hover:text-[#1a1a1a] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#1a1a1a]">Cart</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">

            {/* ── Left column ── */}
            <div>
              <div className="bg-[#fffbf5] rounded border border-[#ede7de] px-4 py-3 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={toggleAll}
                  />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    SELECT ALL ({items.length} ITEM{items.length !== 1 ? 'S' : ''})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="flex items-center gap-1.5 text-xs text-[#8a7a6a] hover:text-red-500 transition-colors font-medium uppercase tracking-wide"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>

              {Object.entries(grouped).map(([seller, sellerItems]) => (
                <SellerGroup
                  key={seller}
                  seller={seller}
                  items={sellerItems}
                  selectedIds={selectedIds}
                  onToggleSeller={toggleSeller}
                  onToggleItem={toggleItem}
                  onRemove={id => dispatch(removeFromCart(id))}
                  onQtyChange={(id, qty) => dispatch(updateQty({ _id: id, qty }))}
                />
              ))}
            </div>

            {/* ── Right column: Order Summary ── */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-[#fffbf5] rounded border border-[#ede7de] overflow-hidden">

                <div className="px-5 py-4 border-b border-[#ede7de]">
                  <h2 className="text-base font-bold text-[#1a1a1a]">Order Summary</h2>
                </div>

                <div className="px-5 py-4 space-y-3 text-sm border-b border-[#ede7de]">
                  <div className="flex justify-between text-[#8a7a6a]">
                    <span>Subtotal ({selectedItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span className="font-semibold text-[#1a1a1a]">Rs. {subtotal.toFixed(0)}</span>
                  </div>

                  {voucherApplied && (
                    <div className="flex justify-between text-[#8B6F52]">
                      <span>Voucher (DRIP20)</span>
                      <span className="font-semibold">−Rs. {discount.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#8a7a6a]">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-[#1a1a1a]">
                      {subtotal === 0 ? 'Rs. 0' : shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {subtotal > 0 && subtotal < 50 && (
                    <div className="text-xs text-[#8B6F52] bg-[#f7f3ee] border border-[#ede7de] rounded px-3 py-2">
                      Add <span className="font-bold">Rs. {(50 - subtotal).toFixed(0)}</span> more for free shipping
                    </div>
                  )}
                </div>

                {/* Voucher */}
                <div className="px-5 py-4 border-b border-[#ede7de] space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucher}
                      onChange={e => { setVoucher(e.target.value); setVoucherError(''); }}
                      onKeyDown={e => e.key === 'Enter' && !voucherApplied && handleApplyVoucher()}
                      placeholder="Enter Voucher Code"
                      disabled={voucherApplied}
                      className="flex-1 text-sm border border-[#ddd6cc] rounded px-3 py-2 focus:outline-none focus:border-[#b89d86] disabled:bg-[#f7f3ee] disabled:text-[#8a7a6a] transition-colors bg-[#fffbf5] text-[#1a1a1a] placeholder-[#8a7a6a]"
                    />
                    {voucherApplied ? (
                      <button
                        onClick={() => { setVoucher(''); setVoucherApplied(false); setVoucherError(''); }}
                        className="px-4 py-2 rounded text-sm font-bold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors whitespace-nowrap"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyVoucher}
                        disabled={!voucher.trim()}
                        className="px-4 py-2 rounded text-sm font-bold text-white bg-[#b89d86] hover:bg-[#8a7a6b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        APPLY
                      </button>
                    )}
                  </div>
                  {voucherError && (
                    <p className="text-xs text-red-500">{voucherError}</p>
                  )}
                  {voucherApplied && (
                    <p className="text-xs text-[#8B6F52] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Voucher DRIP20 applied — 20% off
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="px-5 py-4 border-b border-[#ede7de] flex justify-between items-center">
                  <span className="text-base font-bold text-[#1a1a1a]">Total</span>
                  <span className="text-xl font-black text-[#1a1a1a]">Rs. {total.toFixed(0)}</span>
                </div>

                {/* Checkout button */}
                <div className="px-5 py-4">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkingOut || selectedItems.length === 0}
                    className="w-full py-3.5 rounded-lg text-sm font-bold text-white bg-[#b89d86] hover:bg-[#a88c75] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {checkingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing…
                      </>
                    ) : (
                      `PROCEED TO CHECKOUT (${selectedItems.length})`
                    )}
                  </button>
                </div>
              </div>

              {/* Browse more */}
              <div className="mt-3 bg-[#fffbf5] rounded border border-[#ede7de] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a]">Not done yet?</p>
                  <p className="text-xs text-[#8a7a6a] mt-0.5">Browse more styles</p>
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-bold text-[#8a7a6a] hover:text-[#1a1a1a] transition-colors flex items-center gap-1"
                >
                  Shop
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>

          {/* Mobile sticky checkout */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#fffbf5] border-t border-[#ede7de] z-50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8a7a6a]">{selectedItems.length} item(s) selected</span>
              <span className="text-sm font-black text-[#1a1a1a]">Rs. {total.toFixed(0)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut || selectedItems.length === 0}
              className="w-full py-3 rounded-lg text-sm font-bold text-white bg-[#b89d86] hover:bg-[#a88c75] disabled:opacity-50 transition-colors"
            >
              PROCEED TO CHECKOUT ({selectedItems.length})
            </button>
          </div>
          <div className="lg:hidden h-24" />

        </main>
      </div>
    </>
  );
}