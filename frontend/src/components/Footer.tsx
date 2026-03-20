import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-sm text-muted-foreground sans">
          © 2025. Built with <Heart className="w-4 h-4 inline text-primary fill-primary" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

