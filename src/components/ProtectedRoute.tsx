
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  advisorOnly?: boolean;
  studentOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
  advisorOnly = false,
  studentOnly = false
}) => {
  const { user, userRole, loading, error } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'user:', !!user, 'role:', userRole, 'error:', error);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    console.error('Auth error in ProtectedRoute:', error);
    // Still allow navigation to auth page even with errors
    return <Navigate to="/auth" replace />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (advisorOnly && userRole !== 'advisor') {
    return <Navigate to="/dashboard" replace />;
  }

  if (studentOnly && userRole !== 'student') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
