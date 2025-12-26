import { adConfig } from '@/config/ads';

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = '' }: AdBannerProps) {
  const handleClick = () => {
    if (adConfig.targetUrl) {
      window.open(adConfig.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // If no images are configured, show placeholder
  const hasImages = adConfig.desktopImage || adConfig.mobileImage;

  if (!hasImages) {
    return (
      <div className={`w-full ${className}`}>
        {/* Desktop placeholder */}
        <div 
          className="hidden md:flex items-center justify-center bg-muted border border-border rounded-md cursor-pointer hover-elevate active-elevate-2 w-full max-w-4xl mx-auto"
          style={{ aspectRatio: '970/90', minHeight: '60px' }}
          onClick={handleClick}
          data-testid="ad-banner-desktop"
        >
          <span className="text-sm text-muted-foreground">廣告位置 (響應式)</span>
        </div>
        
        {/* Mobile placeholder */}
        <div 
          className="flex md:hidden items-center justify-center bg-muted border border-border rounded-md cursor-pointer hover-elevate active-elevate-2 w-full"
          style={{ aspectRatio: '320/50', minHeight: '40px' }}
          onClick={handleClick}
          data-testid="ad-banner-mobile"
        >
          <span className="text-xs text-muted-foreground">廣告位置 (響應式)</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop ad */}
      {adConfig.desktopImage && (
        <img
          src={adConfig.desktopImage}
          alt={adConfig.altText}
          className="hidden md:block cursor-pointer rounded-md hover-elevate active-elevate-2 w-full max-w-4xl mx-auto h-auto"
          style={{ aspectRatio: '970/90', objectFit: 'cover' }}
          onClick={handleClick}
          data-testid="ad-banner-desktop"
        />
      )}
      
      {/* Mobile ad */}
      {adConfig.mobileImage && (
        <img
          src={adConfig.mobileImage}
          alt={adConfig.altText}
          className="block md:hidden cursor-pointer rounded-md hover-elevate active-elevate-2 w-full h-auto"
          style={{ aspectRatio: '320/50', objectFit: 'cover' }}
          onClick={handleClick}
          data-testid="ad-banner-mobile"
        />
      )}
    </div>
  );
}
