import { useGetPageContent, useGetContactInfo } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';
import { Mail } from 'lucide-react';
import { SiLinkedin, SiBluesky } from 'react-icons/si';

export default function ContactPage() {
  const { data: pageContent, isLoading: contentLoading } = useGetPageContent('contact');
  const { data: contactInfo, isLoading: contactLoading } = useGetContactInfo();

  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      {contentLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-5xl font-semibold tracking-tight leading-tight">
            {pageContent?.title || 'Contact'}
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

      {contactLoading ? (
        <div className="mt-12 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : contactInfo ? (
        <div className="mt-16 space-y-6">
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-4 p-6 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/20 transition-all group"
            >
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <div className="sans text-sm font-medium text-muted-foreground mb-1">Email</div>
                <div className="text-lg group-hover:text-primary transition-colors">{contactInfo.email}</div>
              </div>
            </a>
          )}

          {contactInfo.linkedIn && (
            <a
              href={contactInfo.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/20 transition-all group"
            >
              <SiLinkedin className="w-6 h-6 text-primary" />
              <div>
                <div className="sans text-sm font-medium text-muted-foreground mb-1">LinkedIn</div>
                <div className="text-lg group-hover:text-primary transition-colors">
                  {contactInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}
                </div>
              </div>
            </a>
          )}

          {contactInfo.bluesky && (
            <a
              href={contactInfo.bluesky}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/20 transition-all group"
            >
              <SiBluesky className="w-6 h-6 text-primary" />
              <div>
                <div className="sans text-sm font-medium text-muted-foreground mb-1">Bluesky</div>
                <div className="text-lg group-hover:text-primary transition-colors">
                  {contactInfo.bluesky.replace(/^https?:\/\/(www\.)?/, '')}
                </div>
              </div>
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
