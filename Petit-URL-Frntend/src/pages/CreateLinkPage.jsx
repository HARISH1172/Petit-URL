import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import SubscriptionPopup from '../components/SubscriptionPopup';
import {
    LinkIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function CreateLinkPage() {
    const { plan } = useAuth();
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [linkCount, setLinkCount] = useState(0);
    const [isSubPopupOpen, setIsSubPopupOpen] = useState(false);

    useEffect(() => {
        const fetchLinkCount = async () => {
            try {
                const res = await api.get('/api/urls');
                setLinkCount(res.data.length);
            } catch (err) {
                console.error("Failed to fetch links count", err);
            }
        };
        fetchLinkCount();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        if (plan !== 'PREMIUM' && linkCount >= 3) {
            setIsSubPopupOpen(true);
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const res = await api.post('/api/urls', { originalUrl: url });
            setResult(res.data);
            setUrl('');
            setLinkCount(prev => prev + 1);
            toast.success('Short URL created!');
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                'Failed to create short URL.';
            toast.error(typeof msg === 'string' ? msg : 'Failed to create short URL.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!result?.shortUrl) return;
        try {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy.');
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create Short Link</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Paste a long URL and get a short, shareable link instantly.
                </p>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-gray-700">
                            Destination URL
                        </label>
                        <div className="relative">
                            <GlobeAltIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                id="url"
                                type="url"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/your-very-long-url"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            />
                        </div>
                    </div>

                    <Button type="submit" loading={loading} className="w-full">
                        <LinkIcon className="h-4 w-4" />
                        Shorten Now
                    </Button>
                </form>
            </div>

            {/* Result Card */}
            {result && (
                <div className="mt-6 animate-[fadeIn_0.3s_ease-out] rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-6 shadow-lg shadow-primary-100/30">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <CheckIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-green-700">Link created successfully!</span>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Short URL</p>
                            <div className="mt-1 flex items-center gap-2">
                                <code className="flex-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-primary-700 ring-1 ring-primary-200 break-all">
                                    {result.shortUrl}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 active:scale-95 cursor-pointer"
                                >
                                    {copied ? (
                                        <CheckIcon className="h-4 w-4" />
                                    ) : (
                                        <ClipboardDocumentIcon className="h-4 w-4" />
                                    )}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Original URL
                            </p>
                            <p className="mt-1 text-sm text-gray-600 break-all">{result.originalUrl}</p>
                        </div>

                        <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
                            <span>ID: {result.id}</span>
                            <span>Clicks: {result.clickCount}</span>
                        </div>
                    </div>
                </div>
            )}

            <SubscriptionPopup
                isOpen={isSubPopupOpen}
                onClose={() => setIsSubPopupOpen(false)}
            />
        </div>
    );
}
