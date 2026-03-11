import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import {
    CheckBadgeIcon,
    SparklesIcon,
    RocketLaunchIcon,
    LinkIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';
import { loadRazorpayScript } from '../utils/loadRazorpay';

export default function SubscriptionPage() {
    const { plan, setPlan } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // 1. Load Razorpay script
            const res = await loadRazorpayScript();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 2. Create order on the backend
            // NOTE: Ensure these match your Spring Boot backend endpoints
            const orderRes = await api.post('/api/payment/create-order', {
                amount: 99,
            });

            // Expected backend response to include the razorpay order id
            const { orderId, amount, currency, key } = orderRes.data;

            // 3. Initialize Razorpay
            const options = {
                key: key || import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: amount,
                currency: currency || "INR",
                name: "Petit URL",
                description: "Upgrade to Premium",
                order_id: orderId, // The order ID created by backend
                handler: async function (response) {
                    try {
                        // 4. Verify payment on the backend
                        await api.post('/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        setPlan('PREMIUM');
                        toast.success('🎉 Upgraded to Premium successfully!');
                    } catch (verifyErr) {
                        const verifyMsg = verifyErr.response?.data?.message || 'Payment verification failed.';
                        toast.error(typeof verifyMsg === 'string' ? verifyMsg : 'Payment verification failed.');
                    }
                },
                prefill: {
                    name: "", // Can prefill with user data if available in AuthContext
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#4f46e5" // Tailwind primary-600
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                'Failed to initiate payment. Please try again.';
            toast.error(typeof msg === 'string' ? msg : 'Failed to initiate payment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">My Subscription</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your plan and billing.</p>
            </div>

            {plan === 'PREMIUM' ? (
                /* Premium Active Card */
                <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white shadow-xl shadow-primary-200/50">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckBadgeSolid className="h-10 w-10 text-yellow-300" />
                        <div>
                            <h2 className="text-xl font-bold">Premium Plan</h2>
                            <p className="text-primary-200 text-sm">Active</p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <CheckBadgeIcon className="h-5 w-5 text-yellow-300" />
                            <span className="text-sm">Unlimited short links</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckBadgeIcon className="h-5 w-5 text-yellow-300" />
                            <span className="text-sm">Click analytics</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckBadgeIcon className="h-5 w-5 text-yellow-300" />
                            <span className="text-sm">Priority support</span>
                        </div>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-4 py-2 backdrop-blur-sm">
                        <SparklesIcon className="h-4 w-4 text-yellow-300" />
                        <span className="text-sm font-semibold text-yellow-100">Premium Active</span>
                    </div>
                </div>
            ) : (
                /* Free Plan — Upgrade Flow */
                <div className="space-y-6">
                    {/* Current plan info */}
                    <div className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                <LinkIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Free Plan</h2>
                                <p className="text-sm text-gray-500">Current plan</p>
                            </div>
                        </div>

                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                            <p className="text-sm font-medium text-amber-800">
                                ⚠️ You can create only <strong>3 links</strong> on the Free plan.
                            </p>
                            <p className="mt-1 text-xs text-amber-600">
                                Upgrade to Premium for unlimited links and more features.
                            </p>
                        </div>
                    </div>

                    {/* Upgrade card */}
                    <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-white p-6 shadow-lg shadow-primary-100/30 ring-1 ring-primary-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                                <RocketLaunchIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Premium Plan</h2>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-extrabold text-primary-600">₹99</span>
                                    <span className="text-sm text-gray-500">/ one-time</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5 mb-6">
                            {[
                                'Unlimited short links',
                                'Detailed click analytics',
                                'Priority support',
                                'Custom link aliases',
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                    <CheckBadgeIcon className="h-5 w-5 text-primary-500" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button onClick={handleUpgrade} loading={loading} className="w-full">
                            <SparklesIcon className="h-4 w-4" />
                            Upgrade to Premium — ₹99
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
