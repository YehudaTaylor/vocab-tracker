import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <LogOut size={18} />
      <span>Log Out</span>
    </button>
  );
};

export default LogoutButton;