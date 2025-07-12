import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.accessToken) {
                    return parsedUser;
                }
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
            }
            localStorage.removeItem('user');
            localStorage.removeItem('token'); 
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(!!user && !!user.accessToken);

    useEffect(() => {
        setIsAuthenticated(!!user && !!user.accessToken);
    }, [user]);


    const login = useCallback(async (username, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Login failed: Server error' }));
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();

            const userDetails = {
                id: data.id,
                username: data.username,
                email: data.email,
                roles: data.roles || [],
                accessToken: data.jwt
            };

            localStorage.setItem('user', JSON.stringify(userDetails));

            setUser(userDetails);
            console.log('User logged in:', userDetails);
            navigate('/');
            return true;
        } catch (error) {
            console.error('AuthContext login error:', error);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            throw error;
        }
    }, [navigate]);

    const register = useCallback(async (username, password, email) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }), 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Registration failed: Server error' }));
                throw new Error(errorData.message || 'Registration failed.');
            }
            return { success: true, message: 'Registration successful!' };

        } catch (error) {
            console.error('AuthContext register error:', error);
            throw error;
        }
    }, []); 

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('User logged out.');
        navigate('/login');
    }, [navigate]);

    const loadUserEntityByUsername = useCallback((uname) => {
        if (user && user.username === uname) {
            return user;
        }
        return null;
    }, [user]);

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        register, 
        loadUserEntityByUsername,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);