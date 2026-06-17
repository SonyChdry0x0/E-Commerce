import { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("🔥 CREATE ACCOUNT CLICKED"); // ADD THIS

  if (!form.name || !form.email || !form.password) {
    setError('Please fill in all fields.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const res = await registerUser(form);
    console.log("API RESPONSE:", res); // ADD THIS

    localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate('/');
    window.location.reload();
  } catch (err) {
    console.log("ERROR:", err); // ADD THIS
    setError(err.response?.data?.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    background: 'var(--bg-primary)',
    borderColor: 'var(--border-card)',
    color: 'var(--text-primary)',
  };

  return (
    <div
      className="min-h-screen antialiased flex items-center justify-center px-6 py-12"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div
        className="rounded-3xl border p-10 w-full max-w-md transition-all"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
      >
        {/* Brand */}
        <Link
          to="/"
          className="text-3xl font-black tracking-tighter block mb-10 select-none"
          style={{
            background: 'linear-gradient(135deg,#d8c2a8,#b89d86,#9d8268)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          DRIP
        </Link>

        <h2 className="text-2xl font-black tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>
          Create account
        </h2>
        <p className="text-sm mb-8 font-medium" style={{ color: 'var(--text-muted)' }}>
          Join the DRIP collective catalogue drop network.
        </p>

        {/* Error */}
        {error && (
          <div
            className="text-xs font-bold mb-5 px-4 py-3 rounded-2xl flex items-center gap-2 border"
            style={{
              color: '#dc2626',
              background: 'rgba(220,38,38,0.06)',
              borderColor: 'rgba(220,38,38,0.15)',
            }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name',      key: 'name',     type: 'text',     placeholder: 'Your full name' },
            { label: 'Email Address',  key: 'email',    type: 'email',    placeholder: 'name@domain.com' },
            { label: 'Password',       key: 'password', type: 'password', placeholder: 'Minimum 6 characters' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none transition-all border"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
              />
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-base text-white disabled:opacity-50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: '#a88c75' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'linear-gradient(135deg, #6d28d9, #db2777)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #ec4899)'}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Create Account'
              }
            </button>
          </div>
        </form>

        <p className="text-center text-xs font-semibold mt-8" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-black transition-colors ml-1"
            style={{ color: '#a855f7' }}
            onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.color = '#a855f7'}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
