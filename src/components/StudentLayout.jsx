import { Outlet } from 'react-router-dom';
import StudentNavbar from './StudentNavbar.jsx';

export default function StudentLayout() {
  return (
    <div className="min-h-screen">
      <StudentNavbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}