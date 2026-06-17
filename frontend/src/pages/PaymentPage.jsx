import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../services/api';
import { useState } from 'react';

const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Credit/Debit Card',
    sub: 'Credit/Debit Card',
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    id: 'esewa',
    label: 'eSewa Mobile Wallet',
    sub: 'eSewa Mobile Wallet',
    icon: (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <span className="text-green-600 font-black text-sm">e</span>
      </div>
    ),
  },
  {
    id: 'khalti',
    label: 'Khalti by IME',
    sub: 'Mobile Wallet',
    icon: (
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <span className="text-purple-600 font-black text-xs">K</span>
      </div>
    ),
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    sub: 'Cash on Delivery',
    icon: (
      <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

export default function PaymentPage() {
  const { items } = useSelector(state => state.cart);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Total + shipping info passed from CheckoutPage via router state
  const { total = 0, shippingAddress = {}, subtotal = 0, deliveryFee = 105 } = location.state || {};
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const [selected, setSelected] = useState('');
  const [placing, setPlacing]   = useState(false);

  const handleConfirm = async () => {
    if (!selected) return;
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    setPlacing(true);
    try {
      await createOrder({
        items: items.map(i => ({ product: i._id, name: i.name, price: i.price, qty: i.qty })),
        total,
        shippingAddress,
        paymentMethod: selected,
      });
      dispatch(clearCart());
      navigate('/orders');
    } catch {
      alert('Order placement failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-gray-600 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/cart')} className="hover:text-gray-600 transition-colors">Cart</button>
          <span>/</span>
          <button onClick={() => navigate('/checkout')} className="hover:text-gray-600 transition-colors">Checkout</button>
          <span>/</span>
          <span className="text-gray-600 font-medium">Payment</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* ── LEFT: Payment Methods ── */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Payment Method</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelected(method.id)}
                  className={`bg-white rounded border p-4 flex flex-col items-center gap-2 text-center transition-all duration-150 hover:shadow-md ${
                    selected === method.id
                      ? 'border-[#b89d86] ring-1 ring-[#b89d86] shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="mb-1">{method.icon}</div>
                  <p className="text-xs font-semibold text-gray-700 leading-tight">{method.label}</p>
                  <p className="text-[10px] text-gray-400">{method.sub}</p>
                </button>
              ))}
            </div>

            {/* Card detail form — only if card selected */}
            {selected === 'card' && (
              <div className="mt-4 bg-white rounded border border-gray-200 p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-700 mb-1">Card Details</h3>
                <input
                  type="text"
                  placeholder="Card number"
                  maxLength={19}
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    maxLength={7}
                    className="border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={4}
                    className="border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            )}

            {/* eSewa info */}
            {selected === 'esewa' && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded p-4">
                <p className="text-sm text-green-700 font-medium">
                  You will be redirected to eSewa to complete your payment securely.
                </p>
              </div>
            )}

            {/* Khalti info */}
            {selected === 'khalti' && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded p-4">
                <p className="text-sm text-purple-700 font-medium">
                  You will be redirected to Khalti to complete your payment securely.
                </p>
              </div>
            )}

            {/* COD info */}
            {selected === 'cod' && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-700 font-medium">
                  Pay with cash when your order is delivered to your door.
                </p>
              </div>
            )}

            {/* Confirm button (mobile) */}
            <div className="mt-5 lg:hidden">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selected || placing}
                className="w-full py-3.5 bg-[#b89d86] hover:bg-[#b89d86] text-white text-sm font-bold rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing order…
                  </>
                ) : (
                  `Confirm & Pay  •  Rs. ${total.toFixed ? total.toFixed(0) : total}`
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">Order Summary</h3>
            </div>

            <div className="px-5 py-4 space-y-3 text-sm border-b border-gray-100">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''} and shipping fee included)</span>
                <span className="font-semibold text-gray-800 ml-4 shrink-0">Rs. {total.toFixed ? total.toFixed(0) : total}</span>
              </div>
            </div>

            <div className="px-5 py-4 flex justify-between items-center">
              <span className="text-base font-bold text-gray-800">Total Amount</span>
              <span className="text-xl font-black text-[#b89d86]">
                Rs. {total.toFixed ? total.toFixed(0) : total}
              </span>
            </div>

            {/* Confirm button (desktop) */}
            <div className="px-5 pb-5 hidden lg:block">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selected || placing}
                className="w-full py-3.5 bg-[#b89d86] hover:bg-[#b89d86] text-white text-sm font-bold rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing order…
                  </>
                ) : selected ? (
                  `Confirm & Pay`
                ) : (
                  'Select a payment method'
                )}
              </button>
              {!selected && (
                <p className="text-xs text-gray-400 text-center mt-2">Choose a method above to continue</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}