import { useState, useEffect } from 'react';
import { useGetPageContent, useUpdatePageContent } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPageEditorProps {
  page: string;
}

export default function AdminPageEditor({ page }: AdminPageEditorProps) {
  const { data: pageContent, isLoading } = useGetPageContent(page);
  const updateContent = useUpdatePageContent();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (pageContent) {
      setTitle(pageContent.title);
      setSubtitle(pageContent.subtitle);
      setContent(pageContent.content);
    }
  }, [pageContent]);

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync({
        page,
        content: { title, subtitle, content },
      });
      toast.success('Content saved successfully', {
        description: `The ${page} page has been updated.`,
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  // Check if there are changes compared to the original content
  const hasChanges = pageContent
    ? title !== pageContent.title || subtitle !== pageContent.subtitle || content !== pageContent.content
    : false;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sans capitalize">{page} Page</CardTitle>
        <CardDescription className="sans">Edit the content for the {page} page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="sans">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page title"
            className="sans"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle" className="sans">
            Subtitle
          </Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Page subtitle"
            className="sans"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="sans">
            Content
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Page content"
            rows={12}
            className="font-serif"
          />
        </div>

        <Button onClick={handleSave} disabled={!hasChanges || updateContent.isPending} className="sans">
          <Save className="w-4 h-4 mr-2" />
          {updateContent.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
