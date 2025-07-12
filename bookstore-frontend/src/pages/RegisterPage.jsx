import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; 

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await register(username, password, email);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-xl bg-white font-sans">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        <div className="mb-4">
          <label htmlFor="regUsername" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
          <input
            type="text"
            id="regUsername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
            focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500"/>
        </div>
        <div className="mb-4">
          <label htmlFor="regEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="regEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
            focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500"/>
        </div>
        <div className="mb-6">
          <label htmlFor="regPassword" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input
            type="password"
            id="regPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
            focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500"/>
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md 
          focus:outline-none focus:shadow-outline transition-colors duration-200">
          Register
        </button>
      </form>
      <p className="text-center text-gray-600 text-sm mt-6">
        Already have an account? <Link to="/login" className="text-green-600 hover:underline font-medium">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;