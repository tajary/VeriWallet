import { Wallet, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              VeriWallet
            </h1>

            <a href="#creds" >Avaiable Credentials</a>
            <a href="#perks" >Perks & Opportunities</a>

          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 px-4 py-2 rounded-full flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-mono">{user?.walletAddress?.slice(0, 8)}...{user?.walletAddress?.slice(-6)}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center font-bold">
              {user?.avatar || 'U'}
            </div>
            <button 
              onClick={handleLogout}
              className="bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}