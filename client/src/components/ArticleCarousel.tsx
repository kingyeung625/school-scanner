import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchOGMetadata } from '@/lib/articlesParser';
import type { Article } from '@shared/school-schema';

interface ArticleCarouselProps {
  articles: Article[];
}

export default function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const { convertText } = useLanguage();
  
  // Create autoplay plugin with useRef to persist across renders
  const autoplayRef = useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true,  // Pause when hovering
      stopOnLastSnap: false     // Continue looping through all slides
    })
  );
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },  // Loop enabled for autoplay to work
    [autoplayRef.current]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [ogImages, setOgImages] = useState<Record<number, string | null>>({});

  // Lazy-load OG images for visible slides
  useEffect(() => {
    if (!articles.length) return;

    const loadOGImage = async (article: Article, index: number) => {
      if (ogImages[index] !== undefined) return; // Already loaded or loading
      
      try {
        const data = await fetchOGMetadata(article.url);
        setOgImages(prev => ({ ...prev, [index]: data.ogImage || null }));
      } catch (err) {
        console.warn(`Failed to fetch OG for article ${index}:`, err);
        setOgImages(prev => ({ ...prev, [index]: null }));
      }
    };

    // Load current and adjacent slides
    const indicesToLoad = [
      selectedIndex,
      selectedIndex - 1,
      selectedIndex + 1
    ].filter(i => i >= 0 && i < articles.length);

    indicesToLoad.forEach(i => loadOGImage(articles[i], i));
  }, [selectedIndex, articles, ogImages]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onInit = () => {
      console.log('[ArticleCarousel] Embla initialized');
      onSelect();
      // Autoplay starts automatically via plugin configuration
    };
    
    // Call onInit immediately if already initialized, or wait for init event
    if (emblaApi.slidesInView().length > 0) {
      onInit();
    } else {
      emblaApi.on('init', onInit);
    }
    
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);
    
    return () => {
      emblaApi.off('init', onInit);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!articles.length) return null;

  return (
    <div className="w-full mb-4" data-testid="card-article-carousel">
      {/* Header with controls - max-width for readability */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">{convertText('新聞報導')}</h3>
          </div>
          {articles.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground" data-testid="text-carousel-count">
                {selectedIndex + 1} / {articles.length}
              </span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  data-testid="button-carousel-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  data-testid="button-carousel-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-width carousel viewport */}
      <div className="w-full overflow-hidden" ref={emblaRef} data-testid="embla-viewport">
        <div className="flex" data-testid="embla-container">
          {articles.map((article, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0"
              data-testid={`carousel-slide-${index}`}
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid={`link-article-${index}`}
              >
                {/* OG Image - full-width, 16:9 aspect ratio */}
                {ogImages[index] ? (
                  <img
                    src={ogImages[index]!}
                    alt={article.title}
                    className="w-full h-auto aspect-video object-cover"
                    data-testid={`img-article-og-${index}`}
                  />
                ) : ogImages[index] === null ? (
                  <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    <Newspaper className="h-16 w-16 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-muted/50 flex items-center justify-center animate-pulse">
                    <Newspaper className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}

                {/* Article title - max-width for readability */}
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-3">
                  <p className="text-sm md:text-base font-medium text-foreground leading-snug" data-testid={`text-article-title-${index}`}>
                    {convertText(article.title)}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
