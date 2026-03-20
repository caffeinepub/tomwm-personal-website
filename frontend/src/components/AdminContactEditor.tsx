import { useState, useEffect } from 'react';
import { useGetContactInfo, useUpdateContactInfo, useGetPageContent, useUpdatePageContent } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContactEditor() {
  const { data: contactInfo, isLoading: contactLoading } = useGetContactInfo();
  const { data: pageContent, isLoading: pageLoading } = useGetPageContent('contact');
  const updateContact = useUpdateContactInfo();
  const updatePage = useUpdatePageContent();

  const [email, setEmail] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [bluesky, setBluesky] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (contactInfo) {
      setEmail(contactInfo.email);
      setLinkedIn(contactInfo.linkedIn);
      setBluesky(contactInfo.bluesky);
    }
  }, [contactInfo]);

  useEffect(() => {
    if (pageContent) {
      setTitle(pageContent.title);
      setSubtitle(pageContent.subtitle);
      setContent(pageContent.content);
    }
  }, [pageContent]);

  const handleSave = async () => {
    try {
      await Promise.all([
        updateContact.mutateAsync({ email, linkedIn, bluesky }),
        updatePage.mutateAsync({
          page: 'contact',
          content: { title, subtitle, content },
        }),
      ]);
      toast.success('Contact information saved successfully', {
        description: 'The contact page and links have been updated.',
      });
    } catch (error) {
      console.error('Error saving contact information:', error);
      toast.error('Failed to save contact information', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  // Check if there are changes in either contact info or page content
  const contactHasChanges = contactInfo
    ? email !== contactInfo.email || linkedIn !== contactInfo.linkedIn || bluesky !== contactInfo.bluesky
    : false;

  const pageHasChanges = pageContent
    ? title !== pageContent.title || subtitle !== pageContent.subtitle || content !== pageContent.content
    : false;

  const hasChanges = contactHasChanges || pageHasChanges;

  if (contactLoading || pageLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sans">Contact Page</CardTitle>
        <CardDescription className="sans">Edit the contact page content and links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold sans">Page Content</h3>
          <div className="space-y-2">
            <Label htmlFor="contact-title" className="sans">
              Title
            </Label>
            <Input
              id="contact-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contact"
              className="sans"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-subtitle" className="sans">
              Subtitle
            </Label>
            <Input
              id="contact-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Get in touch"
              className="sans"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-content" className="sans">
              Content
            </Label>
            <Textarea
              id="contact-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Additional text for the contact page"
              rows={6}
              className="font-serif"
            />
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold sans">Contact Links</h3>
          <div className="space-y-2">
            <Label htmlFor="email" className="sans">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="sans"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="sans">
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="sans"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bluesky" className="sans">
              Bluesky URL
            </Label>
            <Input
              id="bluesky"
              type="url"
              value={bluesky}
              onChange={(e) => setBluesky(e.target.value)}
              placeholder="https://bsky.app/profile/username"
              className="sans"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateContact.isPending || updatePage.isPending}
          className="sans"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateContact.isPending || updatePage.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
