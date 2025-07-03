import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useBlog } from './hooks/useBlog';

// Components
import Header from './components/blog/Header';
import Hero from './components/blog/Hero';
import SearchBox from './components/blog/SearchBox';
import BlogGrid from './components/blog/BlogGrid';
import Sidebar from './components/blog/Sidebar';
import SocialSection from './components/blog/SocialSection';
import Footer from './components/blog/Footer';
import ThemeToggle from './components/ThemeToggle';
import AdminPasswordModal from './components/AdminPasswordModal';
import BlogAdminPanel from './components/blog/BlogAdminPanel';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  // State management
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const {
    posts,
    categories,
    faqs,
    socialLinks,
    siteSettings,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    paginationInfo,
    savePost,
    deletePost,
    saveCategory,
    saveFaq,
    deleteFaq,
    reloadData
  } = useBlog();

  // Modal states
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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

  // Admin panel keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setShowAdminPassword(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleAdminSuccess = () => {
    setShowAdminPassword(false);
    setShowAdminPanel(true);
  };

  // Debug logging
  useEffect(() => {
    console.log('App render - Posts:', posts.length);
    console.log('App render - Loading:', loading);
    console.log('App render - Error:', error);
    console.log('App render - Theme:', theme);
  }, [posts, loading, error, theme]);

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
      {/* Theme Toggle Button - Fixed and Visible */}
      <div 
        className="fixed top-5 right-5 z-50"
        style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 9999 
        }}
      >
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      
      <Header siteSettings={siteSettings} />
      
      <Hero siteSettings={siteSettings} />
      
      <div className="blog-container">
        <main className="blog-main">
          <SearchBox 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />
          
          <BlogGrid
            posts={posts}
            paginationInfo={paginationInfo}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </main>
        
        <Sidebar
          categories={categories}
          faqs={faqs}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <SocialSection socialLinks={socialLinks} />
      
      <Footer siteSettings={siteSettings} />

      {/* Modals */}
      <AdminPasswordModal
        isOpen={showAdminPassword}
        onClose={() => setShowAdminPassword(false)}
        onSuccess={handleAdminSuccess}
      />
      
      <BlogAdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        posts={posts}
        categories={categories}
        faqs={faqs}
        onSavePost={savePost}
        onDeletePost={deletePost}
        onSaveCategory={saveCategory}
        onSaveFaq={saveFaq}
        onDeleteFaq={deleteFaq}
      />
    </div>
  );
}

export default App;