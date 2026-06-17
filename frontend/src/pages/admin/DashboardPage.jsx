import { useEffect, useState } from 'react';
import { getAllOrders, getProducts, getUsers } from '../../services/api';

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4`}>
      <div className={`text-3xl p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  pending:   'bg-yellow-900 text-yellow-300',
  shipped:   'bg-blue-900 text-blue-300',
  delivered: 'bg-green-900 text-green-300',
  cancelled: 'bg-red-900 text-red-300',
};

export default function DashboardPage() {
  const [orders, setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllOrders(), getProducts(), getUsers()])
      .then(([o, p, u]) => {
        setOrders(o.data);
        setProducts(p.data);
        setUsers(u.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue"  value={`$${revenue.toFixed(2)}`} icon="💰" color="bg-indigo-950 text-indigo-400" />
        <StatCard label="Total Orders"   value={orders.length}            icon="📦" color="bg-blue-950 text-blue-400" />
        <StatCard label="Total Products" value={products.length}          icon="👕" color="bg-emerald-950 text-emerald-400" />
        <StatCard label="Total Users"    value={users.length}             icon="👥" color="bg-purple-950 text-purple-400" />
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.slice(0, 8).map(order => (
                <tr key={order._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-gray-400">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-3 text-gray-300">
                    {order.user?.name || '—'}
                  </td>
                  <td className="px-6 py-3 text-white font-medium">
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-800 text-gray-300'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-gray-500 py-8">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
