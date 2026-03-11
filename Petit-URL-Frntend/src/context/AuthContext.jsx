import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [plan, setPlan] = useState('FREE');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isAuthenticated = !!token;

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            fetchSubscription();
        } else {
            localStorage.removeItem('token');
            setPlan('FREE');
        }
    }, [token]);

    const fetchSubscription = async () => {
        try {
            const res = await api.get('/api/subscription');
            setPlan(res.data.planType || 'FREE');
        } catch (err) {
            console.error("Failed to fetch subscription", err);
            setPlan('FREE');
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            const jwt = res.data.token;
            setToken(jwt);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            console.error("LOGIN ERROR", err);
            console.log("LOGIN ERROR RESPONSE", err.response);
            console.log("LOGIN ERROR STATUS", err.response?.status);

            const status = err.response?.status;
            // Suppress default toast for 401/404 so LoginPage can show a custom popup
            if (status !== 401 && status !== 404) {
                const msg = err.response?.data?.message || err.response?.data || 'Login failed. Please try again.';
                toast.error(typeof msg === 'string' ? msg : 'Login failed.');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        setLoading(true);
        try {
            await api.post('/api/auth/signup', { name, email, password });
            toast.success('Account created! Please log in.');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Signup failed. Please try again.';
            toast.error(typeof msg === 'string' ? msg : 'Signup failed.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setPlan('FREE');
        toast.success('Logged out successfully.');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, plan, setPlan, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
