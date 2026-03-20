import { useState } from 'react';
import {
  useGetAllEssays,
  useAddEssay,
  useUpdateEssay,
  useDeleteEssay,
  useSetFeaturedEssay,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Plus, Edit, Trash2, Star, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { Essay } from '../backend';

export default function AdminEssayManager() {
  const { data: essays = [], isLoading } = useGetAllEssays();
  const addEssay = useAddEssay();
  const updateEssay = useUpdateEssay();
  const deleteEssay = useDeleteEssay();
  const setFeatured = useSetFeaturedEssay();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [publicationDate, setPublicationDate] = useState('');

  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setTags('');
    setPublicationDate('');
    setEditingEssay(null);
  };

  const handleAdd = async () => {
    if (!title || !excerpt || !publicationDate) {
      toast.error('Missing required fields', {
        description: 'Please fill in title, excerpt, and publication date.',
      });
      return;
    }

    try {
      const date = new Date(publicationDate);
      const timestamp = BigInt(date.getTime() * 1000000);
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

      await addEssay.mutateAsync({
        title,
        excerpt,
        tags: tagArray,
        publicationDate: timestamp,
      });

      toast.success('Essay added successfully', {
        description: `"${title}" has been added to your writing collection.`,
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding essay:', error);
      toast.error('Failed to add essay', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  const handleEdit = async () => {
    if (!editingEssay || !title || !excerpt || !publicationDate) {
      toast.error('Missing required fields', {
        description: 'Please fill in title, excerpt, and publication date.',
      });
      return;
    }

    try {
      const date = new Date(publicationDate);
      const timestamp = BigInt(date.getTime() * 1000000);
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

      await updateEssay.mutateAsync({
        id: editingEssay.id,
        title,
        excerpt,
        tags: tagArray,
        publicationDate: timestamp,
      });

      toast.success('Essay updated successfully', {
        description: `"${title}" has been updated.`,
      });
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating essay:', error);
      toast.error('Failed to update essay', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  const handleDelete = async (id: bigint, essayTitle: string) => {
    try {
      await deleteEssay.mutateAsync(id);
      toast.success('Essay deleted successfully', {
        description: `"${essayTitle}" has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting essay:', error);
      toast.error('Failed to delete essay', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  const handleSetFeatured = async (id: bigint, essayTitle: string) => {
    try {
      await setFeatured.mutateAsync(id);
      toast.success('Featured essay updated', {
        description: `"${essayTitle}" is now the featured essay.`,
      });
    } catch (error) {
      console.error('Error setting featured essay:', error);
      toast.error('Failed to set featured essay', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  const openEditDialog = (essay: Essay) => {
    setEditingEssay(essay);
    setTitle(essay.title);
    setExcerpt(essay.excerpt);
    setTags(essay.tags.join(', '));
    const date = new Date(Number(essay.publicationDate) / 1000000);
    setPublicationDate(date.toISOString().split('T')[0]);
    setIsEditDialogOpen(true);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="sans">Essays</CardTitle>
            <CardDescription className="sans">Manage your writing collection.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="sans">
                <Plus className="w-4 h-4 mr-2" />
                Add Essay
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="sans">Add New Essay</DialogTitle>
                <DialogDescription className="sans">Create a new essay entry for your writing page.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="add-title" className="sans">
                    Title
                  </Label>
                  <Input
                    id="add-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Essay title"
                    className="sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-excerpt" className="sans">
                    Excerpt
                  </Label>
                  <Textarea
                    id="add-excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description or excerpt"
                    rows={4}
                    className="font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-tags" className="sans">
                    Tags (comma-separated)
                  </Label>
                  <Input
                    id="add-tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="philosophy, technology, culture"
                    className="sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-date" className="sans">
                    Publication Date
                  </Label>
                  <Input
                    id="add-date"
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="sans"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }} className="sans">
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={addEssay.isPending} className="sans">
                  {addEssay.isPending ? 'Adding...' : 'Add Essay'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {essays.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 sans">No essays yet. Add your first essay to get started.</p>
        ) : (
          <div className="space-y-4">
            {essays.map((essay) => (
              <div
                key={essay.id.toString()}
                className="p-4 border border-border/40 rounded-lg space-y-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{essay.title}</h3>
                      {essay.isFeatured && (
                        <Badge variant="default" className="sans">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{essay.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground sans">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(essay.publicationDate)}
                      </span>
                      {essay.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {essay.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="sans text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!essay.isFeatured && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetFeatured(essay.id, essay.title)}
                        disabled={setFeatured.isPending}
                        className="sans"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(essay)} className="sans">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="sans">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="sans">Delete Essay</AlertDialogTitle>
                          <AlertDialogDescription className="sans">
                            Are you sure you want to delete "{essay.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="sans">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(essay.id, essay.title)}
                            className="sans bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="sans">Edit Essay</DialogTitle>
              <DialogDescription className="sans">Update the essay details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="sans">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Essay title"
                  className="sans"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt" className="sans">
                  Excerpt
                </Label>
                <Textarea
                  id="edit-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description or excerpt"
                  rows={4}
                  className="font-serif"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags" className="sans">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="edit-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="philosophy, technology, culture"
                  className="sans"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="sans">
                  Publication Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="sans"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }} className="sans">
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={updateEssay.isPending} className="sans">
                {updateEssay.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
