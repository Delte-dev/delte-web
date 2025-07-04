import React, { useState, useEffect } from 'react';
import { Theme, User } from './types/store';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useStore } from './hooks/useStore';

// Components
import Header from './components/store/Header';
import Hero from './components/store/Hero';
import ProductGrid from './components/store/ProductGrid';
import Footer from './components/store/Footer';
import ThemeToggle from './components/ThemeToggle';
import LoginModal from './components/store/LoginModal';
import AdminPanel from './components/store/AdminPanel';
import SupportPanel from './components/store/SupportPanel';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import NotificationModal from './components/NotificationModal';

function App() {
  // State management
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  
  const {
    products,
    categories,
    faqs,
    socialLinks,
    siteSettings,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    reloadData
  } = useStore();

  // Modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSupportPanel, setShowSupportPanel] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      document.body.className = 'dark-mode';
      document.body.style.backgroundColor = '#1a202c';
      document.body.style.color = '#e2e8f0';
    } else {
      document.body.className = '';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#333333';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Admin panel keyboard shortcuts (Ctrl + Shift + Z)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setShowAdminPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLogin(false);
    showNotification('success', '🎉 ¡Bienvenido!', `Hola ${user.name}, has iniciado sesión correctamente.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowSupportPanel(false);
    showNotification('info', '👋 Sesión Cerrada', 'Has cerrado sesión correctamente.');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={reloadData} />;
  }

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${theme === 'dark' ? 'dark-mode' : ''}`}
      style={{
        backgroundColor: theme === 'dark' ? '#1a202c' : '#ffffff',
        color: theme === 'dark' ? '#e2e8f0' : '#333333'
      }}
    >
      {/* Theme Toggle Button */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      
      <Header 
        siteSettings={siteSettings}
        currentUser={currentUser}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onShowSupport={() => setShowSupportPanel(true)}
      />
      
      <Hero siteSettings={siteSettings} />
      
      <main className="container mx-auto px-4 py-8">
        <ProductGrid
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          currentUser={currentUser}
          onLoginRequired={() => setShowLogin(true)}
          onNotification={showNotification}
        />
      </main>

      <Footer 
        socialLinks={socialLinks} 
        siteSettings={siteSettings}
        faqs={faqs}
      />

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onNotification={showNotification}
      />

      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        onNotification={showNotification}
      />

      {currentUser && (
        <SupportPanel
          isOpen={showSupportPanel}
          onClose={() => setShowSupportPanel(false)}
          currentUser={currentUser}
          onNotification={showNotification}
        />
      )}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
}

export default App;