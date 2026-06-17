import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { useState } from 'react';

const NEPAL_REGIONS = ['Bagmati', 'Gandaki', 'Karnali', 'Lumbini', 'Madhesh', 'Sudurpashchim', 'Koshi'];
const CITIES_BY_REGION = {
  Bagmati: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kirtipur', 'Hetauda'],
  Gandaki: ['Pokhara', 'Baglung', 'Gorkha', 'Damauli'],
  Karnali: ['Birendranagar', 'Jumla', 'Dailekh'],
  Lumbini: ['Butwal', 'Bhairahawa', 'Palpa', 'Dang'],
  Madhesh: ['Janakpur', 'Birgunj', 'Rajbiraj', 'Biratnagar'],
  Sudurpashchim: ['Dhangadhi', 'Mahendranagar', 'Dadeldhura'],
  Koshi: ['Biratnagar', 'Dharan', 'Itahari', 'Birtamod'],
};

const DELIVERY_FEE = 105;

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, type = 'text', error }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border rounded px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400 transition-colors placeholder:text-gray-300 ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
      }`}
    />
  );
}

function SelectInput({ placeholder, value, onChange, options, disabled }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400 transition-colors disabled:bg-gray-100 disabled:text-gray-400 bg-white appearance-none"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px', paddingRight: '32px' }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items } = useSelector(state => state.cart);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  // Form state
  const [form, setForm] = useState({
    fullName: '', phone: '', building: '', colony: '',
    region: '', city: '', area: '', address: '', label: 'HOME',
  });
  const [errors, setErrors]       = useState({});
  const [placing, setPlacing]     = useState(false);
  const [promo, setPromo]         = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]     = useState('');
  const [showContactEdit, setShowContactEdit] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const cities = form.region ? (CITIES_BY_REGION[form.region] || []) : [];

  // Totals
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const promoDiscount = promoApplied ? subtotal * 0.2 : 0;
  const total = subtotal - promoDiscount + DELIVERY_FEE;
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  // Validate
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.region) e.region = 'Please select a region';
    if (!form.city) e.city = 'Please select a city';
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === 'DRIP20') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid or expired code.');
      setPromoApplied(false);
    }
  };

  // In handlePay inside CheckoutPage.jsx
const handlePay = () => {
  if (!validate()) return;
  navigate('/payment', {
    state: { total, subtotal, deliveryFee: DELIVERY_FEE, shippingAddress: form }
  });
};

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-gray-600 transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* ── LEFT: Delivery Form ── */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Delivery Information</h2>
            </div>

            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full name */}
              <Field label="Full name" error={errors.fullName}>
                <TextInput
                  placeholder="Enter your first and last name"
                  value={form.fullName}
                  onChange={set('fullName')}
                  error={errors.fullName}
                />
              </Field>

              {/* Region */}
              <Field label="Region" error={errors.region}>
                <SelectInput
                  placeholder="Please choose your region"
                  value={form.region}
                  onChange={v => { set('region')(v); set('city')(''); set('area')(''); }}
                  options={NEPAL_REGIONS}
                />
              </Field>

              {/* Phone */}
              <Field label="Phone Number" error={errors.phone}>
                <TextInput
                  placeholder="Please enter your phone number"
                  value={form.phone}
                  onChange={set('phone')}
                  type="tel"
                  error={errors.phone}
                />
              </Field>

              {/* City */}
              <Field label="City" error={errors.city}>
                <SelectInput
                  placeholder="Please choose your city"
                  value={form.city}
                  onChange={v => { set('city')(v); set('area')(''); }}
                  options={cities}
                  disabled={!form.region}
                />
              </Field>

              {/* Building */}
              <Field label="Building / House No / Floor / Street">
                <TextInput
                  placeholder="Please enter"
                  value={form.building}
                  onChange={set('building')}
                />
              </Field>

              {/* Area */}
              <Field label="Area">
                <TextInput
                  placeholder="Enter your area / neighbourhood"
                  value={form.area}
                  onChange={set('area')}
                />
              </Field>

              {/* Colony */}
              <Field label="Colony / Suburb / Locality / Landmark">
                <TextInput
                  placeholder="Please enter"
                  value={form.colony}
                  onChange={set('colony')}
                />
              </Field>

              {/* Address */}
              <Field label="Address" error={errors.address}>
                <TextInput
                  placeholder="e.g. House# 123, Street# 123, ABC Road"
                  value={form.address}
                  onChange={set('address')}
                  error={errors.address}
                />
              </Field>
            </div>

            {/* Label selector */}
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-600 font-medium mb-3">Select a label for effective delivery:</p>
              <div className="flex items-center gap-3">
                {['OFFICE', 'HOME'].map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => set('label')(lbl)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded border text-sm font-semibold transition-all ${
                      form.label === lbl
                        ? 'border-[#b89d86] text-[#b89d86] bg-orange-50'
                        : 'border-gray-300 text-gray-500 bg-white hover:border-gray-400'
                    }`}
                  >
                    {lbl === 'OFFICE' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    )}
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Save / Continue */}
            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={() => { if (validate()) {} }}
                className="px-8 py-3 bg-[#b89d86] hover:bg-[#887462] text-white text-sm font-bold rounded transition-colors"
              >
                SAVE
              </button>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="space-y-4">

            {/* Promotion */}
            <div className="bg-white rounded border border-gray-200 px-5 py-4">
              <h3 className="text-base font-bold text-gray-800 mb-3">Promotion</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promo}
                  onChange={e => { setPromo(e.target.value); setPromoError(''); }}
                  onKeyDown={e => e.key === 'Enter' && !promoApplied && handleApplyPromo()}
                  placeholder="Enter store/Drip Code"
                  disabled={promoApplied}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                />
                {promoApplied ? (
                  <button
                    onClick={() => { setPromo(''); setPromoApplied(false); }}
                    className="px-4 py-2 rounded text-sm font-bold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors whitespace-nowrap"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promo.trim()}
                    className="px-4 py-2 bg-[#b89d86] hover:bg-[#947f6d] text-white text-sm font-bold rounded disabled:opacity-40 transition-colors whitespace-nowrap"
                  >
                    APPLY
                  </button>
                )}
              </div>
              {promoError && <p className="text-xs text-[#b89d86] mt-1.5">{promoError}</p>}
              {promoApplied && (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  DRIP20 applied — 20% off
                </p>
              )}
            </div>

            {/* Invoice & Contact */}
            <div className="bg-white rounded border border-gray-200 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800">Invoice and Contact Info</h3>
                <button
                  onClick={() => setShowContactEdit(!showContactEdit)}
                  className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {showContactEdit ? 'Done' : 'Edit'}
                </button>
              </div>

              {showContactEdit ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Contact name"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No contact info saved yet. Click Edit to add.</p>
              )}
            </div>

            {/* Order Detail */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-800">Order Detail</h3>
              </div>

              {/* Product list */}
              <div className="px-5 py-3 space-y-2 border-b border-gray-100 max-h-48 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item._id}-${item.selectedSize}`} className="flex items-center gap-3">
                    <div className="w-10 h-12 rounded border border-gray-100 bg-gray-50 shrink-0 overflow-hidden">
                      {(item.images?.[0] || item.image) && (
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-tight line-clamp-2">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-[10px] text-gray-400 mt-0.5">Size: {item.selectedSize}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-800">Rs. {(item.price * item.qty).toFixed(0)}</p>
                      <p className="text-[10px] text-gray-400">×{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 space-y-2.5 text-sm border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <span className="font-semibold text-gray-800">Rs. {subtotal.toFixed(0)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount (20%)</span>
                    <span className="font-semibold">−Rs. {promoDiscount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-800">Rs. {DELIVERY_FEE}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                  <span className="font-bold text-gray-800">Total:</span>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#b89d86]">Rs. {total.toFixed(0)}</p>
                    <p className="text-[10px] text-gray-400">All taxes included</p>
                  </div>
                </div>
              </div>

              {/* Pay button */}
              <div className="px-5 py-4">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={placing}
                  className="w-full py-3.5 bg-[#b89d86] hover:bg-[#f7c599] text-white text-sm font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {placing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    'Proceed to Pay'
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}