import { useEffect } from 'react';

const SITE_URL = 'https://www.truecleankc.com';

export function useDocumentHead(title: string, description: string, path: string = '/') {
  useEffect(() => {
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    const canonicalUrl = `${SITE_URL}${path}`;

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  }, [title, description, path]);
}
