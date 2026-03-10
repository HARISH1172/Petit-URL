import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LinkIcon,
    QueueListIcon,
    CreditCardIcon,
    ArrowRightStartOnRectangleIcon,
    XMarkIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';

const navItems = [
    { to: '/dashboard/create', label: 'Create Link', icon: LinkIcon },
    { to: '/dashboard/links', label: 'My Links', icon: QueueListIcon },
    { to: '/dashboard/subscription', label: 'My Subscription', icon: CreditCardIcon },
];

export default function Sidebar({ open, onClose }) {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
                            <LinkIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            Petit URL
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden cursor-pointer"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map(({ to, label, icon: Icon }) => {
                        const isActive = location.pathname === to;
                        return (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={onClose}
                                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon
                                    className={`h-5 w-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                                        }`}
                                />
                                {label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-gray-100 p-3">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                        <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export function SidebarToggle({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden cursor-pointer"
        >
            <Bars3Icon className="h-5 w-5" />
        </button>
    );
}
