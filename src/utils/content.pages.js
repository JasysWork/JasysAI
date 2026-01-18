import { CONFIG } from '../config/index.js';
import { LOGO_SVG } from './assets.js';
import { ContentModel } from '../models/index.js';

export async function ContentPage(env, pageKey) {
  const content = await ContentModel.get(env, pageKey);
  
  const pageConfig = {
    about: {
      title: 'About Us',
      description: 'Learn more about our company and mission'
    },
    blog: {
      title: 'Blog',
      description: 'Latest news and updates from our team'
    },
    contact: {
      title: 'Contact Us',
      description: 'Get in touch with our team'
    },
    privacy_policy: {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data'
    },
    terms_of_service: {
      title: 'Terms of Service',
      description: 'Terms and conditions for using our service'
    },
    security: {
      title: 'Security',
      description: 'Security measures and best practices'
    }
  };

  const config = pageConfig[pageKey] || { title: 'Content', description: '' };

  return `
<!DOCTYPE html><html lang="en" class="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
  <!-- Navigation -->
  <nav class="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3 font-bold text-2xl">
        ${LOGO_SVG} ${CONFIG.site_name}
      </div>
      <div class="hidden md:flex items-center gap-6">
        <a href="/" class="text-slate-300 hover:text-white transition">Home</a>
        <a href="#features" class="text-slate-300 hover:text-white transition">Features</a>
        <a href="#pricing" class="text-slate-300 hover:text-white transition">Pricing</a>
        <a href="#api" class="text-slate-300 hover:text-white transition">API</a>
        <button onclick="showLogin()" class="bg-brand px-6 py-2 rounded-full font-bold hover:bg-brand/90 transition">Sign In</button>
      </div>
      <button onclick="toggleMobileMenu()" class="md:hidden text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
  </nav>

  <!-- Content Section -->
  <section class="pt-32 pb-20 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-black mb-4">${content.title || config.title}</h1>
        <p class="text-xl text-slate-300">${config.description}</p>
        ${content.last_updated ? `<p class="text-sm text-slate-500 mt-2">Last updated: ${new Date(content.last_updated).toLocaleDateString()}</p>` : ''}
      </div>
      
      <div class="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-12">
        ${content.content ? `
          <div class="prose prose-invert max-w-none">
            ${content.content.replace(/\n/g, '<br>')}
          </div>
        ` : `
          <div class="text-center py-12">
            <div class="text-slate-400 mb-4">
              <svg class="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Content Coming Soon</h3>
            <p class="text-slate-400">This page is being updated by our team. Please check back soon.</p>
          </div>
        `}
      </div>
      
      <div class="text-center mt-8">
        <a href="/" class="inline-flex items-center gap-2 text-brand hover:text-brand/80 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-900/80 backdrop-blur-sm border-t border-slate-800/50 py-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-3 font-bold text-xl text-white mb-4">
            ${LOGO_SVG} ${CONFIG.site_name}
          </div>
          <p class="text-slate-400 text-sm">
            Your gateway to powerful AI models with simple, transparent pricing.
          </p>
        </div>
        
        <div>
          <h4 class="font-bold text-white mb-4">Product</h4>
          <ul class="space-y-2 text-slate-400 text-sm">
            <li><a href="/#features" class="hover:text-white transition">Features</a></li>
            <li><a href="/#pricing" class="hover:text-white transition">Pricing</a></li>
            <li><a href="/#api" class="hover:text-white transition">API Docs</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold text-white mb-4">Company</h4>
          <ul class="space-y-2 text-slate-400 text-sm">
            <li><a href="/about" class="hover:text-white transition">About</a></li>
            <li><a href="/blog" class="hover:text-white transition">Blog</a></li>
            <li><a href="/contact" class="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold text-white mb-4">Legal</h4>
          <ul class="space-y-2 text-slate-400 text-sm">
            <li><a href="/privacy-policy" class="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="/terms-of-service" class="hover:text-white transition">Terms of Service</a></li>
            <li><a href="/security" class="hover:text-white transition">Security</a></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-slate-800/50 pt-8 text-center text-slate-400 text-sm">
        <p>&copy; 2026 ${CONFIG.site_name}. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script>
    function toggleMobileMenu() {
      // Mobile menu functionality
    }
    
    function showLogin() {
      location.href = '/app';
    }
  </script>
</body></html>`;
}