import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

//components
import Loader from './components/Loader';
const Protector = lazy(() => import('./components/Protector'));
const Layout = lazy(() => import('./components/Layout'));

//public
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyPassword = lazy(() => import('./pages/auth/VerifyPassword'));

const NotFound = lazy(() => import('./pages/notes/NotFound'));

//private
const Profile = lazy(() => import('./pages/auth/Profile'));
const Dashboard = lazy(() => import('./pages/notes/Dashboard'));
const Read = lazy(() => import('./pages/notes/Read'));


function App() {

  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Toaster />

      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Private routes - require authentication */}
          <Route element={<Protector isPrivate user={user} redirectTo="/login" />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/read/:noteId" element={<Read />} />
            </Route>
          </Route>

          {/* Public routes - only accessible when not authenticated */}
          <Route element={<Protector user={user} redirectTo="/" />}>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/new-password" element={<VerifyPassword />} />
          </Route>

          {/* Shared routes */}
          <Route path="/loader" element={<Loader />} />

          {/* Redirect all unknown paths */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;