import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `block px-4 py-2.5 text-sm font-medium rounded-card transition-colors ${
    isActive ? 'bg-signal text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-850 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-display font-semibold text-lg">
            Quiz<span className="text-signal">Admin</span>
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/students" className={linkClass}>Students</NavLink>
          <NavLink to="/admin/categories" className={linkClass}>Categories</NavLink>
          <NavLink to="/admin/quizzes" className={linkClass}>Quizzes</NavLink>
          <NavLink to="/admin/attempts" className={linkClass}>Attempts</NavLink>
          <NavLink to="/admin/analytics" className={linkClass}>Analytics</NavLink>
        </nav>
        <div className="p-3 border-t border-white/10">
          <p className="px-3 text-xs text-white/40 mb-2 truncate">{user?.email}</p>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-card">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-paper min-h-screen">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}