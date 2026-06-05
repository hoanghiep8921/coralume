'use client';

import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

/**
 * Facebook Page Plugin embed — SRS §8: "Social embed — Facebook page widget"
 *
 * Embeds the Coralume Facebook page as a widget.
 * Requires the Facebook SDK to be loaded (added in layout).
 */
export function FacebookPagePlugin() {
  useEffect(() => {
    // Load Facebook SDK if not already loaded
    if (typeof window !== 'undefined' && !document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v22.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden p-4">
      <h3 className="font-headline-sm text-primary mb-3 text-sm">Theo dõi chúng tôi trên Facebook</h3>
      <div
        className="fb-page"
        data-href={siteConfig.links.facebook}
        data-tabs="timeline"
        data-width=""
        data-height="400"
        data-small-header="true"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote cite={siteConfig.links.facebook} className="fb-xfbml-parse-ignore">
          <a href={siteConfig.links.facebook}>Coralume</a>
        </blockquote>
      </div>
    </div>
  );
}
