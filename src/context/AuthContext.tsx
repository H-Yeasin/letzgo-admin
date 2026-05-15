import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminLogin } from '../api/admin';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (phone: string, otp: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (phone: string, otp: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminLogin(phone, otp);
            localStorage.setItem('admin_token', res.access_token);
            setToken(res.access_token);
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'Login failed. Please check credentials.';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                login,
                logout,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}