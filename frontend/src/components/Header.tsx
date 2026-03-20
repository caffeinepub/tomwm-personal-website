import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Shield } from 'lucide-react';

type Page = 'home' | 'about' | 'writing' | 'contact' | 'admin';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onNavigate('home');
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  // Show admin link only if user is authenticated and confirmed as admin
  const showAdminLink = isAuthenticated && !isAdminLoading && isAdmin === true;

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors"
          >
            Tomwm
          </button>

          <nav className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className={`sans text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'home' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`sans text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'about' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate('writing')}
              className={`sans text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'writing' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Writing
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`sans text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'contact' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Contact
            </button>

            {showAdminLink && (
              <button
                onClick={() => onNavigate('admin')}
                className={`sans text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${
                  currentPage === 'admin' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}

            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="sans"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
