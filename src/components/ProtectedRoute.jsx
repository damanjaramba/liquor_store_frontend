import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required role if specified
  if (requiredRole) {
    // Check if user has the required role (case insensitive comparison)
    const userRole = currentUser?.role?.toUpperCase();
    if (userRole !== requiredRole.toUpperCase()) {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;