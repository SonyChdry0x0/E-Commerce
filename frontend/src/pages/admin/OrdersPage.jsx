import { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    getMyOrders()
      .then(res => setOrders(res.data || res))
      .catch(err => console.error("Error fetching orders:", err));
  }, [navigate]);

  return (
    <div className="min-h-screen antialiased" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h1 className="text-4xl font-black tracking-tighter mb-10" style={{ color: 'var(--text-primary)' }}>
          Order History
        </h1>

        {orders.length === 0 ? (
          <div
            className="rounded-3xl p-16 text-center border max-w-xl mx-auto"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
          >
            <span className="text-5xl block mb-4 select-none">📦</span>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              No orders placed yet
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Your premium catalogue drops will show up here as soon as you execute a checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order._id}
                className="rounded-2xl p-6 border transition-shadow duration-300"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
              >
                {/* Order Header */}
                <div
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5 pb-4 border-b"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                      Order Reference ID
                    </p>
                    <p
                      className="text-xs font-mono font-medium px-2 py-1 rounded-md inline-block border"
                      style={{
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-primary)',
                        borderColor: 'var(--border-card)',
                      }}
                    >
                      {order._id}
                    </p>
                    <p className="text-xs font-semibold mt-2" style={{ color: 'var(--text-muted)' }}>
                      Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                    <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase border ${
                      order.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                        : order.status === 'shipped'
                        ? 'bg-sky-50 text-sky-700 border-sky-200/50 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20'
                        : 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                    <p className="font-black text-xl tracking-tight mt-2" style={{ color: 'var(--text-primary)' }}>
                      ${order.total ? order.total.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm font-medium py-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                        <span
                          className="text-xs font-bold rounded px-1.5 py-0.5 border"
                          style={{
                            color: 'var(--text-muted)',
                            background: 'var(--bg-primary)',
                            borderColor: 'var(--border-card)',
                          }}
                        >
                          ×{item.qty}
                        </span>
                      </div>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        ${((item.price || 0) * (item.qty || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
