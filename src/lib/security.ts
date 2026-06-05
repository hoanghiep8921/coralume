import createDOMPurify from 'dompurify';

// ============================================================
// XSS SANITIZATION
// ============================================================

/**
 * Lazy-initialized DOMPurify instance.
 * In the browser, DOMPurify works natively with the DOM.
 * On the server (Node.js), we polyfill with JSDOM via a dynamic
 * require that is never bundled into client-side code.
 *
 * Uses dompurify v3.x API (returns purify functions directly).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let purifyInstance: ReturnType<typeof createDOMPurify> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPurify(): ReturnType<typeof createDOMPurify> {
  if (purifyInstance) return purifyInstance;

  if (typeof window !== 'undefined') {
    // Browser — DOMPurify uses the native DOM
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    purifyInstance = createDOMPurify(window as any);
  } else {
    // Server — polyfill with JSDOM (tree-shaken from client bundles)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { JSDOM } = require('jsdom');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    purifyInstance = createDOMPurify((new JSDOM('')).window as any);
  }

  return purifyInstance;
}

/** Allowed HTML tags for blog content (rich text) */
const BLOG_ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'sup', 'sub',
];

const BLOG_ALLOWED_ATTRS = [
  'href', 'target', 'rel', 'title',
  'src', 'alt', 'width', 'height', 'loading',
  'class', 'id',
  'colspan', 'rowspan',
];

/** Sanitize HTML content for blog posts (preserves rich formatting) */
export function sanitizeBlogHtml(html: string): string {
  const purify = getPurify();
  return purify.sanitize(html, {
    ALLOWED_TAGS: BLOG_ALLOWED_TAGS,
    ALLOWED_ATTR: BLOG_ALLOWED_ATTRS,
    ALLOW_DATA_ATTR: false,
  });
}

/** Strip ALL HTML tags — safe for plain text fields (name, email subject, etc.) */
export function sanitizePlainText(input: string): string {
  const purify = getPurify();
  return purify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/** HTML-escape a string for safe embedding in HTML context */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ============================================================
// OPEN REDIRECT PROTECTION
// ============================================================

const ALLOWED_HOSTS = [
  'coralume.vn',
  'www.coralume.vn',
  'localhost',
];

/**
 * Validate callback URL to prevent open redirect attacks.
 * Only allows relative paths (starting with /) or same-origin absolute URLs.
 * Returns the sanitized URL string or the default fallback.
 */
export function validateCallbackUrl(callbackUrl: string | null, fallback = '/dashboard'): string {
  if (!callbackUrl) return fallback;

  // Relative path — safe
  if (callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
    // Prevent CRLF injection in redirect
    return callbackUrl.replace(/[\r\n]/g, '');
  }

  // Absolute URL — check if same origin
  try {
    const url = new URL(callbackUrl);
    const isAllowed = ALLOWED_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`)
    );
    if (isAllowed) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    // Invalid URL — reject
  }

  return fallback;
}

// ============================================================
// XSS PAYLOAD DETECTION (for Zod refinements)
// ============================================================

const XSS_PATTERNS = [
  /<script\b[^>]*>/i,
  /javascript\s*:/i,
  /\bon\w+\s*=\s*["']?[^"'>]*["']?/i,
  /<iframe\b[^>]*>/i,
  /<object\b[^>]*>/i,
  /<embed\b[^>]*>/i,
  /data\s*:\s*text\/html/i,
  /<link\b[^>]*>/i,
  /<meta\b[^>]*>/i,
];

/** Check if a string contains known XSS payloads. Returns true if suspicious. */
export function containsXss(input: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}
