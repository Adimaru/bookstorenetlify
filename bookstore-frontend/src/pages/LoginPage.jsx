import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            toast.info("You are already logged in.");
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const success = await login(username, password);
            if (success) {
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-xl bg-white font-sans">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                        leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                        mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"/>
                </div>
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md 
                    focus:outline-none focus:shadow-outline transition-colors duration-200">
                    Login
                </button>
            </form>
            <p className="text-center text-gray-600 text-sm mt-6">
                Don't have an account? <Link to="/register" className="text-green-600 hover:underline font-medium">Register here</Link>
            </p>
        </div>
    );
}
export default LoginPage;