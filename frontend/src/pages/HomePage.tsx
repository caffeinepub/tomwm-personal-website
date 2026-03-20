import { useGetPageContent, useGetFeaturedEssay } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Calendar } from 'lucide-react';

export default function HomePage() {
  const { data: pageContent, isLoading: contentLoading } = useGetPageContent('home');
  const { data: featuredEssay, isLoading: essayLoading } = useGetFeaturedEssay();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      {contentLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-5xl font-semibold tracking-tight leading-tight">
            {pageContent?.title || 'Welcome'}
          </h1>
          {pageContent?.subtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {pageContent.subtitle}
            </p>
          )}
          {pageContent?.content && (
            <div className="prose prose-lg mt-8 leading-relaxed whitespace-pre-wrap">
              {pageContent.content}
            </div>
          )}
        </div>
      )}

      {featuredEssay && (
        <div className="mt-20 pt-12 border-t border-border/40">
          <h2 className="text-sm font-medium text-muted-foreground mb-8 sans uppercase tracking-wider">
            Featured Essay
          </h2>
          {essayLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <article className="space-y-4">
              <h3 className="text-3xl font-semibold tracking-tight leading-tight hover:text-primary transition-colors">
                {featuredEssay.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground sans">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(featuredEssay.publicationDate)}
                </span>
              </div>
              {featuredEssay.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featuredEssay.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="sans">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-lg leading-relaxed text-muted-foreground mt-4">
                {featuredEssay.excerpt}
              </p>
            </article>
          )}
        </div>
      )}
    </div>
  );
}
