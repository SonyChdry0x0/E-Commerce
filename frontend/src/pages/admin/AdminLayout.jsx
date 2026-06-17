import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const links = [
  { to: '/admin',          label: 'Dashboard', icon: '▦' },
  { to: '/admin/products', label: 'Products',  icon: '👕' },
  { to: '/admin/orders',   label: 'Orders',    icon: '📦' },
  { to: '/admin/users',    label: 'Users',     icon: '👥' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?.isAdmin) navigate('/login');
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-lg font-bold tracking-tight text-white">⚡ Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
