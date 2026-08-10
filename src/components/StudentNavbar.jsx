import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-card transition-colors ${
    isActive ? 'bg-signal-light text-signal-dark' : 'text-ink/60 hover:text-ink'
  }`;

export default function StudentNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-ink/8 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-display font-semibold text-lg tracking-tight">
            Quiz<span className="text-signal">Platform</span>
          </span>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/quizzes" className={linkClass}>Browse Quizzes</NavLink>
            <NavLink to="/history" className={linkClass}>My Attempts</NavLink>
            <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink/60 hidden sm:inline">{user?.name}</span>
          <button onClick={handleLogout} className="btn-secondary !py-2 !px-3 text-sm">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}