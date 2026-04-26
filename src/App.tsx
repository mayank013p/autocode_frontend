import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Insights from './pages/Insights';
import NoteDetail from './pages/NoteDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import { authService } from './services/authService';

function App() {
  const { token, loading: authLoading, login } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isProcessingGh, setIsProcessingGh] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !!params.get('code') && !token;
  });

  // Handle GitHub Callback
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !token) {
      console.log("[AUTH] GitHub code detected, starting exchange scene...");
      
      // Clean up URL immediately to avoid double-processing
      window.history.replaceState({}, document.title, "/");
      
      authService.githubLogin(undefined, code)
        .then(data => {
          console.log("[AUTH] GitHub exchange successful");
          login(data.token, data.user);
        })
        .catch(err => {
          console.error("GitHub Scene Error:", err);
          alert("GitHub authentication failed. Please try again.");
        })
        .finally(() => {
          setIsProcessingGh(false);
        });
    }
  }, [token, login, isProcessingGh]);

  const loading = authLoading || isProcessingGh;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const handleOpenNote = (note: any) => {
    setSelectedNote(note);
    setCurrentView('note-detail');
  };

  const handleBackToNotes = () => {
    setCurrentView('notes');
    setSelectedNote(null);
  };

  return (
    <Layout activeTab={currentView === 'note-detail' ? 'notes' : currentView} onTabChange={setCurrentView}>
      <>
        {currentView === 'dashboard' && (
          <Dashboard 
            onOpenNote={handleOpenNote} 
            onViewAll={() => setCurrentView('notes')} 
          />
        )}
        {currentView === 'notes' && <Notes onOpenNote={handleOpenNote} />}
        {currentView === 'insights' && <Insights />}
        {currentView === 'note-detail' && selectedNote && (
          <NoteDetail note={selectedNote} onBack={handleBackToNotes} />
        )}
      </>
    </Layout>
  );
}

export default App;
