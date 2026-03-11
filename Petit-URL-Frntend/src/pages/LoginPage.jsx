import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { LinkIcon, EnvelopeIcon, LockClosedIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowPopup(false);
        try {
            await login(form.email, form.password);
        } catch (err) {
            const status = err.response?.status;
            if (status === 401 || status === 404) {
                setShowPopup(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 relative">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-200">
                        <LinkIcon className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="mt-1 text-sm text-gray-500">Sign in to your Petit URL account</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    type="text"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-base font-[sans-serif] text-gray-900 placeholder:text-gray-400 placeholder:text-sm placeholder:font-sans transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>
                        </div>

                        <Button type="submit" loading={loading} className="w-full">
                            Sign In
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                        Create one
                    </Link>
                </p>
            </div>

            {/* Unauthorized / Not Registered Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-900">Unauthorized User</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                We couldn't find an account with those credentials. Please create an account first to continue.
                            </p>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <Button
                                variant="secondary"
                                className="flex-1 justify-center"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-[2] justify-center"
                                onClick={() => navigate('/signup')}
                            >
                                Create Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
