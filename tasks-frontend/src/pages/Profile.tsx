import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Generate a consistent avatar based on user's name or email
  const avatarSvg = useMemo(async () => {
    const seed = user?.name || user?.email || 'User';
    const avatar = createAvatar(initials, {
      seed,
      radius: 50,
      size: 96,
      fontSize: 48,
      fontFamily: ['Arial', 'sans-serif'],
      fontWeight: 600,
      backgroundType: ['gradientLinear'],
      backgroundColor: [
        'b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf',
        'f9b4d0', 'b4e0e8', 'd8bfd8', 'ffd700', '98fb98'
      ]
    });
    return await avatar.toDataUri();
  }, [user?.name, user?.email]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account information and settings
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-8">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img 
                    src={avatarSvg}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-2 border-white shadow-md"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}'/><text x='50%' y='55%' font-family='Arial, sans-serif' font-size='48' font-weight='600' text-anchor='middle' fill='white'>${user?.name?.charAt(0).toUpperCase() || 'U'}</text></svg>`;
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h2>
                  <p className="text-sm text-gray-500">{user?.email || ''}</p>
                  <p className="text-sm text-gray-500">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.name || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user?.email || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user?.phone || 'Not provided'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {user?.role || 'user'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Account Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-500">Update your password</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-factor authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
