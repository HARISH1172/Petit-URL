import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import DashboardLayout from '../components/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import CreateLinkPage from '../pages/CreateLinkPage';
import MyLinksPage from '../pages/MyLinksPage';
import SubscriptionPage from '../pages/SubscriptionPage';
import RedirectHandler from '../pages/RedirectHandler';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

            {/* Protected Dashboard Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="create" replace />} />
                <Route path="create" element={<CreateLinkPage />} />
                <Route path="links" element={<MyLinksPage />} />
                <Route path="subscription" element={<SubscriptionPage />} />
            </Route>

            {/* Short URL Redirect Route - Must be placed before the catch-all wildcard */}
            <Route path="/:shortCode" element={<RedirectHandler />} />

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
