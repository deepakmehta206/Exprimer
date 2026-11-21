/** Smooth-scroll to an element id, accounting for the fixed header. */
export function scrollToAnchor(id: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({
    behavior: reduce ? 'auto' : behavior,
    block: 'start',
  });
  return true;
}

export type CtaTarget =
  | { kind: 'anchor'; fragment: string }
  | { kind: 'route'; path: string; fragment?: string }
  | { kind: 'external'; url: string };

/** Parse CMS CTA hrefs like `#services`, `/home#contact`, `/media`, or absolute URLs. */
export function parseCtaHref(href: string): CtaTarget {
  const raw = (href || '').trim();
  if (!raw) return { kind: 'anchor', fragment: 'services' };

  if (/^https?:\/\//i.test(raw) || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
    return { kind: 'external', url: raw };
  }

  if (raw.startsWith('#')) {
    return { kind: 'anchor', fragment: raw.slice(1) };
  }

  const hashIdx = raw.indexOf('#');
  if (hashIdx >= 0) {
    const path = raw.slice(0, hashIdx) || '/home';
    const fragment = raw.slice(hashIdx + 1);
    return { kind: 'route', path, fragment };
  }

  return { kind: 'route', path: raw };
}
