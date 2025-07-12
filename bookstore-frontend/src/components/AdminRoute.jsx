
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; 

function AdminRoute({ children }) {
  const { user, loading } = useAuth(); 

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-700">Loading user session...</div>;
  }
  if (!user) {
    toast.error("You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'ADMIN') {
    toast.error("You do not have administrative access.");
    return <Navigate to="/" replace />;
  }
  return children;
}

export default AdminRoute;