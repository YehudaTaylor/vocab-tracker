import React, { useState } from 'react';
import { BookOpen, History, Menu, X } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import TranslationForm from './components/TranslationForm';
import TranslationHistory from './components/TranslationHistory';
import UserProfile from './components/UserProfile';
import LoginButton from './components/LoginButton';
import AuthenticationGuard from './components/AuthenticationGuard';

function App() {
  const [activeTab, setActiveTab] = useState<'translate' | 'history'>('translate');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth0();

  const handleTranslationComplete = () => {
    setRefreshTrigger(prev => prev + 1);
    if (activeTab === 'translate') {
      setTimeout(() => setActiveTab('history'), 1000);
    }
  };

  const tabs = [
    { id: 'translate', label: 'Translate', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="text-primary-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Vocab Tracker</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'translate' | 'history')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop User Profile */}
            <div className="hidden md:block">
              {isAuthenticated ? <UserProfile /> : <LoginButton />}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as 'translate' | 'history');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile User Profile */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {isAuthenticated ? <UserProfile /> : <LoginButton />}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'translate' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Translate & Track Words
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enter an English word to get its translation and automatically add it to your vocabulary tracker 
                for spaced repetition learning.
              </p>
            </div>
            <TranslationForm onTranslationComplete={handleTranslationComplete} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Vocabulary History
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Review all the words you've translated and track your learning progress over time.
              </p>
            </div>
            <TranslationHistory refreshTrigger={refreshTrigger} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Vocab Tracker. Built with React, Node.js, and PostgreSQL.</p>
            <p className="mt-1">Enhance your language learning with spaced repetition.</p>
          </div>
        </div>
      </footer>
      </div>
    </AuthenticationGuard>
  );
}

export default App;
