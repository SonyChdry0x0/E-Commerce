import { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));


if (res.data.user.isAdmin) {
  navigate('/admin');
} else {
  navigate('/');
}
      // ✅ redirect user back to where they came from
 } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
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
          }}
        >
          DRIP
        </Link>

        <h2 className="text-2xl font-black mb-1.5">Welcome back</h2>
        <p className="text-sm mb-8">Sign in to access your account.</p>

        {error && (
          <div className="text-[#a88c75] text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          

          <input
  type="email"
  placeholder="Email"
  value={form.email}
  onChange={(e) => setForm({ ...form, email: e.target.value })}
  className="w-full p-3 rounded-xl border"
  style={{
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid #ccc'
  }}
/>

<input
  type="password"
  placeholder="Password"
  value={form.password}
  onChange={(e) => setForm({ ...form, password: e.target.value })}
  className="w-full p-3 rounded-xl border"
  style={{
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid #ccc'
  }}
/>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white bg-[#a88c75]"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-300 font-bold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}