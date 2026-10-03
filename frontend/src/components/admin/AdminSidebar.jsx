import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
