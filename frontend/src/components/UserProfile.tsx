import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from 'lucide-react';
import LogoutButton from './LogoutButton';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600" />
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900">
            {user.name || user.email}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};

export default UserProfile;