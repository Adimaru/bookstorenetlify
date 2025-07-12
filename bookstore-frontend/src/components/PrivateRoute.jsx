import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth(); 

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-700">Loading user session...</div>;
  }

  if (user) {
    return children;
  }
  return <Navigate to="/login" replace />;
}

export default PrivateRoute; 