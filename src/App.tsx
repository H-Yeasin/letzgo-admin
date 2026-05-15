import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import ActiveRides from './pages/ActiveRides';
import CompletedRides from './pages/CompletedRides';
import Reports from './pages/Reports';
import Disputes from './pages/Disputes';
import MeetupReports from './pages/MeetupReports';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="rides/active" element={<ActiveRides />} />
                <Route path="rides/completed" element={<CompletedRides />} />
                <Route path="reports" element={<Reports />} />
                <Route path="disputes" element={<Disputes />} />
                <Route path="meetup-reports" element={<MeetupReports />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}