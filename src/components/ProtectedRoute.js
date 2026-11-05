import { Navigate } from 'react-router-dom';
import { getUser } from '../auth';

function ProtectedRoute({ children }) {
  return getUser() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
