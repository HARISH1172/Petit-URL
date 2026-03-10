import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon,
    ArrowTopRightOnSquareIcon,
    LinkIcon,
} from '@heroicons/react/24/outline';

export default function MyLinksPage() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editUrl, setEditUrl] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/urls');
            setLinks(res.data);
        } catch {
            toast.error('Failed to load links.');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (link) => {
        setEditingId(link.id);
        setEditUrl(link.originalUrl);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditUrl('');
    };

    const saveEdit = async (id) => {
        if (!editUrl.trim()) return;
        setSaving(true);
        try {
            const res = await api.put(`/api/urls/${id}`, { originalUrl: editUrl });
            setLinks((prev) => prev.map((l) => (l.id === id ? res.data : l)));
            toast.success('Link updated!');
            cancelEdit();
        } catch {
            toast.error('Failed to update link.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Links</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage and track all your shortened URLs.
                </p>
            </div>

            {links.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                        <LinkIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No links yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Create your first short link to get started.</p>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-100 md:block">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Original URL
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Short URL
                                    </th>
                                    <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Clicks
                                    </th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {links.map((link) => (
                                    <tr key={link.id} className="transition-colors hover:bg-gray-50/50">
                                        {/* Original URL */}
                                        <td className="max-w-xs px-6 py-4">
                                            {editingId === link.id ? (
                                                <input
                                                    type="url"
                                                    value={editUrl}
                                                    onChange={(e) => setEditUrl(e.target.value)}
                                                    className="w-full rounded-lg border border-primary-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="block truncate text-sm text-gray-700">{link.originalUrl}</span>
                                            )}
                                        </td>

                                        {/* Short URL */}
                                        <td className="px-6 py-4">
                                            <a
                                                href={link.shortUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                            >
                                                {link.shortUrl}
                                                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                                            </a>
                                        </td>

                                        {/* Clicks */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                                                {link.clickCount}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            {editingId === link.id ? (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => saveEdit(link.id)}
                                                        disabled={saving}
                                                        className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50"
                                                    >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startEdit(link)}
                                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile card list */}
                    <div className="space-y-3 md:hidden">
                        {links.map((link) => (
                            <div
                                key={link.id}
                                className="rounded-xl bg-white p-4 shadow-md shadow-gray-200/50 ring-1 ring-gray-100"
                            >
                                {editingId === link.id ? (
                                    <div className="space-y-3">
                                        <input
                                            type="url"
                                            value={editUrl}
                                            onChange={(e) => setEditUrl(e.target.value)}
                                            className="w-full rounded-lg border border-primary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                onClick={() => saveEdit(link.id)}
                                                loading={saving}
                                                className="flex-1 text-xs"
                                            >
                                                Save
                                            </Button>
                                            <Button variant="secondary" onClick={cancelEdit} className="text-xs">
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-2">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Original
                                            </p>
                                            <p className="mt-0.5 text-sm text-gray-700 break-all">{link.originalUrl}</p>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Short URL
                                            </p>
                                            <a
                                                href={link.shortUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-primary-600"
                                            >
                                                {link.shortUrl}
                                                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                                                {link.clickCount} clicks
                                            </span>
                                            <button
                                                onClick={() => startEdit(link)}
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                                            >
                                                <PencilSquareIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
