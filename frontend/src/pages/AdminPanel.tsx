import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Shield, AlertCircle, LogIn } from 'lucide-react';
import AdminPageEditor from '../components/AdminPageEditor';
import AdminEssayManager from '../components/AdminEssayManager';
import AdminContactEditor from '../components/AdminContactEditor';
import { useEffect } from 'react';

interface AdminPanelProps {
  onAccessDenied?: () => void;
}

export default function AdminPanel({ onAccessDenied }: AdminPanelProps) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Redirect if access is denied
  useEffect(() => {
    if (!isLoading && isAdmin === false && onAccessDenied) {
      onAccessDenied();
    }
  }, [isAdmin, isLoading, onAccessDenied]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground sans">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Alert>
          <LogIn className="h-4 w-4" />
          <AlertTitle className="sans font-semibold">Authentication Required</AlertTitle>
          <AlertDescription className="sans mt-2">
            You must be logged in to access the admin panel.
          </AlertDescription>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="mt-4 sans"
            size="sm"
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        </Alert>
      </div>
    );
  }

  // Show access denied if authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="sans font-semibold">Access Denied</AlertTitle>
          <AlertDescription className="sans mt-2">
            You must be an administrator to view this page. If you believe this is an error, please contact the site administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-semibold tracking-tight">Admin Panel</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Manage your website content, essays, and contact information.
        </p>
      </div>

      <Tabs defaultValue="home" className="space-y-8">
        <TabsList className="sans">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <AdminPageEditor page="home" />
        </TabsContent>

        <TabsContent value="about">
          <AdminPageEditor page="about" />
        </TabsContent>

        <TabsContent value="writing">
          <AdminEssayManager />
        </TabsContent>

        <TabsContent value="contact">
          <AdminContactEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
