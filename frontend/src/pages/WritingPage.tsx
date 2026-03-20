import { useGetAllEssays } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Calendar, Star } from 'lucide-react';

export default function WritingPage() {
  const { data: essays, isLoading } = useGetAllEssays();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <div className="space-y-6 mb-16">
        <h1 className="text-5xl font-semibold tracking-tight leading-tight">Writing</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Essays, thoughts, and reflections.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : essays && essays.length > 0 ? (
        <div className="space-y-16">
          {essays.map((essay) => (
            <article key={essay.id.toString()} className="space-y-4 pb-12 border-b border-border/40 last:border-0">
              <div className="flex items-start gap-3">
                <h2 className="text-3xl font-semibold tracking-tight leading-tight flex-1 hover:text-primary transition-colors">
                  {essay.title}
                </h2>
                {essay.isFeatured && (
                  <Star className="w-5 h-5 text-primary fill-primary flex-shrink-0 mt-1" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground sans">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(essay.publicationDate)}
                </span>
              </div>
              {essay.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {essay.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="sans">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-lg leading-relaxed text-muted-foreground">
                {essay.excerpt}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No essays yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

