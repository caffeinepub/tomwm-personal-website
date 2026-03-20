import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WritingPage from './pages/WritingPage';
import ContactPage from './pages/ContactPage';
import AdminPanel from './pages/AdminPanel';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useState, useEffect } from 'react';

type Page = 'home' | 'about' | 'writing' | 'contact' | 'admin';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Redirect non-admin users away from admin page
  useEffect(() => {
    if (currentPage === 'admin' && !isAdminLoading && isAdmin === false) {
      setCurrentPage('home');
    }
  }, [currentPage, isAdmin, isAdminLoading]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'writing':
        return <WritingPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPanel onAccessDenied={() => setCurrentPage('home')} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
