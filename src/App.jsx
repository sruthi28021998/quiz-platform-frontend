import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import StudentLayout from './components/StudentLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';

import StudentDashboard from './pages/student/StudentDashboard.jsx';
import QuizList from './pages/student/QuizList.jsx';
import QuizDetails from './pages/student/QuizDetails.jsx';
import QuizAttempt from './pages/student/QuizAttempt.jsx';
import QuizResult from './pages/student/QuizResult.jsx';
import AttemptHistory from './pages/student/AttemptHistory.jsx';
import Leaderboard from './pages/student/Leaderboard.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminStudents from './pages/admin/AdminStudents.jsx';
import AdminStudentProfile from './pages/admin/AdminStudentProfile.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminQuizzes from './pages/admin/AdminQuizzes.jsx';
import AdminQuizForm from './pages/admin/AdminQuizForm.jsx';
import AdminQuestions from './pages/admin/AdminQuestions.jsx';
import AdminAttempts from './pages/admin/AdminAttempts.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Student area */}
      <Route element={<ProtectedRoute role="STUDENT" />}>
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizDetails />} />
          <Route path="/history" element={<AttemptHistory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results/:attemptId" element={<QuizResult />} />
        </Route>
        {/* Full-screen, no nav chrome during a timed attempt */}
        <Route path="/attempt/:attemptId" element={<QuizAttempt />} />
      </Route>

      {/* Admin area */}
      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentProfile />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/quizzes" element={<AdminQuizzes />} />
          <Route path="/admin/quizzes/new" element={<AdminQuizForm />} />
          <Route path="/admin/quizzes/:id/edit" element={<AdminQuizForm />} />
          <Route path="/admin/quizzes/:id/questions" element={<AdminQuestions />} />
          <Route path="/admin/attempts" element={<AdminAttempts />} />
          <Route path="/admin/attempts/:attemptId" element={<QuizResult />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}