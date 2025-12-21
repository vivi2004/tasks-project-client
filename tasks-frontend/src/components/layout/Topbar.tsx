import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store/user.store';
import { logoutApi } from '../../api/auth.api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Topbar = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        {location.pathname !== '/dashboard' && (
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
                return;
              }
              navigate('/dashboard');
            }}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-800">TaskFlow</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.name || user?.email?.split('@')[0] || 'User'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                Profile
              </Link>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                role="menuitem"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;