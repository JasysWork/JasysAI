import { DB } from '../db/index.js';
import { AuthService } from '../auth/auth.service.js';
import { ContentPage } from '../utils/content.pages.js';
import { ApiDocsPage } from '../utils/api-docs.pages.js';
import { authRoutes } from './auth.routes.js';
import { adminRoutes } from './admin.routes.js';
import { userRoutes } from './user.routes.js';
import { apiRoutes } from './api.routes.js';

export async function setupRoutes(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  // Static assets - serve logo and favicon
  if (path.startsWith('/assets/')) {
    if (path === '/assets/logo.png') {
      // Return a simple SVG logo as PNG (for now)
      const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#7c3aed"/><text x="32" y="40" font-family="Arial" font-size="24" fill="white" text-anchor="middle">AI</text></svg>`;
      return new Response(logoSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    }
    return new Response('Asset not found', { status: 404 });
  }

  // Content pages
  if (path === '/about' || path === '/blog' || path === '/contact' ||
      path === '/privacy-policy' || path === '/terms-of-service' || path === '/security') {
    try {
      const pageKey = path.replace('/', '').replace('-', '_');
      const html = await ContentPage(request, env, pageKey);
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    } catch (error) {
      console.error('Error serving content page:', error);
      // Return a basic HTML error page instead of JSON
      const errorHtml = `
<!DOCTYPE html><html lang="en" class="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen flex items-center justify-center px-6">
  <div class="max-w-2xl w-full text-center">
    <div class="mb-8">
      <svg class="w-20 h-20 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    </div>
    <h1 class="text-4xl font-bold mb-4">Something went wrong</h1>
    <h2 class="text-2xl text-yellow-400 mb-6">500 Internal Server Error</h2>
    <p class="text-slate-300 mb-8">
      We're sorry, but something went wrong on our end.
      Our team has been notified and is working to resolve the issue.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/" class="inline-flex items-center justify-center gap-2 bg-brand px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        Back to Home
      </a>
      <button onclick="location.reload()" class="inline-flex items-center justify-center gap-2 bg-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Try Again
      </button>
    </div>
    <p class="text-slate-500 text-sm mt-8">Error Details: ${error.message}</p>
    <p class="text-slate-500 text-sm">Error ID: ${Date.now()}</p>
  </div>
</body></html>`;
      return new Response(errorHtml, {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }

  // API Documentation page
  if (path === '/api-docs') {
    const html = ApiDocsPage(request);
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }

  // Landing page
  if (path === '/') {
    return authRoutes(request, env);
  }

  // Admin routes
  if (path.startsWith('/admin')) {
    return adminRoutes(request, env);
  }

  // User dashboard routes (including /app)
  if (path.startsWith('/app')) {
    return userRoutes(request, env);
  }

  // Authentication routes
  if (path.startsWith('/auth/')) {
    return authRoutes(request, env);
  }

  // API routes
  if (path.startsWith('/api/')) {
    return apiRoutes(request, env);
  }

  // Logout route
  if (path === '/logout') {
    const cookie = request.headers.get('cookie') || '';
    const userToken = cookie.split('t=')[1]?.split(';')[0];
    const adminToken = cookie.split('adm_t=')[1]?.split(';')[0];

    // Delete session from KV if it exists
    if (userToken) {
      await DB.del(env, `sess:${userToken}`);
    }
    if (adminToken) {
      await DB.del(env, `sess:${adminToken}`);
    }

    // Clear cookies
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': [
          't=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
          'adm_t=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
        ]
      }
    });
  }

  // OpenAI-compatible API routes (no /api prefix)
  if (path === '/v1/chat/completions') {
    return apiRoutes(request, env);
  }

  // Guest chat interface
  if (path === '/chat/guest') {
    return new Response(getGuestChatHTML(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // User chat interface
  if (path === '/chat') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('t=')[1]?.split(';')[0];
    if (!token) {
      return Response.redirect(`${url.origin}/app`, 302);
    }
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess) {
      return Response.redirect(`${url.origin}/app`, 302);
    }
    return new Response(getUserChatHTML(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // 404 - Custom Not Found Page
  return new Response(getNotFoundPage(path), { 
    status: 404,
    headers: { 'Content-Type': 'text/html' }
  });
}