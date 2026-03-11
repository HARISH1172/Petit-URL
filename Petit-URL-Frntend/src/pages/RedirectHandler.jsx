import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RedirectHandler() {
    const { shortCode } = useParams();

    useEffect(() => {
        if (shortCode) {
            // Redirect the window to the backend which will handle the 302 redirect
            const backendUrl = api.defaults.baseURL || 'https://petit-url.onrender.com';
            window.location.replace(`${backendUrl}/${shortCode}`);
        }
    }, [shortCode]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100">
                <LoadingSpinner size="lg" />
                <h2 className="mt-4 text-lg font-semibold text-gray-900">Redirecting...</h2>
                <p className="mt-1 text-sm text-gray-500">Taking you to your destination</p>
            </div>
        </div>
    );
}
