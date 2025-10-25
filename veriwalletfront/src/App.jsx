import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CredentialExplorer from './pages/CredentialExplorer';
import PerkExplorer from './pages/PerkExplorer';
import Login from './pages/Login';
import CredentialIssuanceManager from './components/CredentialIssuanceManager';
import CredentialPerksManager from './components/CredentialPerksManager';
import SidebarLayout from './pages/SidebarLayout';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  // const { isAuthenticated } = useAuth();

  const { user, loading } = useAuth();

  console.log("In App content: ", user, loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {currentView === 'sidebar' && <SidebarLayout />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'credentials' && <CredentialExplorer />}
        {currentView === 'perks' && <PerkExplorer />}
      </main>
    </div>
  );
}

function App(){
  return <AppContent />
}

export default App;