import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Series from './pages/Series';
import Anime from './pages/Anime';
import SeriesDetail from './pages/SeriesDetail';
import PersonDetail from './pages/PersonDetail';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import Diary from './pages/Diary';
import Library from './pages/Library';
import Profile from './pages/Profile';
import SharePage from './pages/SharePage';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0a0a0a',
            color: 'white'
          }}
        >
          <h2>Something went wrong</h2>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            style={{
              marginTop: 16,
              padding: '8px 24px',
              background: '#E50914',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const safeGetSession = () => {
  try {
    return localStorage.getItem('navrasa_session');
  } catch (error) {
    console.error('Failed to read navrasa session', error);
    return null;
  }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = safeGetSession();
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login key={location.pathname} />} />
      <Route path="/share" element={<SharePage key={location.pathname} />} />

      {/* Protected Layout Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout key={location.pathname} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home key={location.pathname} />} />
        <Route path="series" element={<Series key={location.pathname} />} />
        <Route path="series/:id" element={<SeriesDetail key={location.pathname} />} />
        <Route path="anime" element={<Anime key={location.pathname} />} />
        <Route path="anime/:id" element={<SeriesDetail key={location.pathname} />} />
        <Route path="movie/:id" element={<MovieDetail key={location.pathname} />} />
        <Route path="person/:name" element={<PersonDetail key={location.pathname} />} />
        <Route path="wishlist" element={<Wishlist key={location.pathname} />} />
        <Route path="diary" element={<Diary key={location.pathname} />} />
        <Route path="library" element={<Library key={location.pathname} />} />
        <Route path="profile" element={<Profile key={location.pathname} />} />
        <Route path="admin" element={<Admin key={location.pathname} />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={safeGetSession() ? '/' : '/login'} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
