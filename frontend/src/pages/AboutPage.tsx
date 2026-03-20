import { useGetPageContent } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';

export default function AboutPage() {
  const { data: pageContent, isLoading } = useGetPageContent('about');

  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-64 w-full mt-8" />
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-5xl font-semibold tracking-tight leading-tight">
            {pageContent?.title || 'About'}
          </h1>
          {pageContent?.subtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {pageContent.subtitle}
            </p>
          )}
          {pageContent?.content && (
            <div className="prose prose-lg mt-12 leading-relaxed whitespace-pre-wrap">
              {pageContent.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
