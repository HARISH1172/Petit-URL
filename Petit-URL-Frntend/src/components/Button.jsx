import LoadingSpinner from './LoadingSpinner';

const variants = {
    primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm',
    danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    ghost:
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500',
};

export default function Button({
    children,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    return (
        <button
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${className}`}
            {...props}
        >
            {loading && <LoadingSpinner size="sm" />}
            {children}
        </button>
    );
}
