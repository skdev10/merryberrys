/** Mobile access control — configurable via env. */

export const MOBILE_BLOCK_MESSAGE = {
  title: 'Desktop Only',
  heading: 'This application is currently not available on mobile.',
  body: 'Kindly open this application on a desktop or laptop browser to continue.',
};

const MOBILE_UA_PATTERNS = [
  /Android/i,
  /webOS/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /BlackBerry/i,
  /IEMobile/i,
  /Opera Mini/i,
  /Windows Phone/i,
  /Mobile/i,
  /Tablet/i,
  /Kindle/i,
  /Silk/i,
];

export function isBlockMobileEnabled() {
  const flag = process.env.MOBILE_BLOCK_ENABLED ?? process.env.NEXT_PUBLIC_MOBILE_BLOCK_ENABLED;
  if (flag === undefined || flag === '') return true;
  return flag === 'true' || flag === '1';
}

export function isMobileUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return MOBILE_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function isSkippablePath(pathname) {
  if (!pathname) return true;
  if (pathname.startsWith('/api/')) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname === '/favicon.ico') return true;
  if (/\.(ico|png|jpe?g|gif|webp|svg|css|js|mjs|map|woff2?|ttf|eot|txt|xml|json)$/i.test(pathname)) {
    return true;
  }
  return false;
}

export function buildMobileBlockHtml() {
  const { title, heading, body } = MOBILE_BLOCK_MESSAGE;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} | Merry Berry</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f0;
      color: #0a0a0a;
    }
    .card {
      max-width: 420px;
      width: 100%;
      background: #fff;
      border: 1px solid #e8e8e3;
      border-radius: 16px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #c9a96e;
      margin-bottom: 20px;
    }
    h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 12px; line-height: 1.3; }
    p { font-size: 0.95rem; color: #5c5c5c; line-height: 1.6; }
    .logo {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #da2c77, #c9a96e);
      color: #fff; font-weight: 700; font-size: 1.25rem;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">M</div>
    <p class="badge">${title}</p>
    <h1>${heading}</h1>
    <p style="margin-top:16px">${body}</p>
  </div>
</body>
</html>`;
}
