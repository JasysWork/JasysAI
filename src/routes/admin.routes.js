import { DB } from '../db/index.js';
import { AdminApp } from '../dashboard/admin/admin.pages.js';
import { AdminController } from '../dashboard/admin/admin.controller.js';
import { ContentController } from '../dashboard/admin/content.controller.js';
import { ContentManagementPage } from '../dashboard/admin/content.pages.js';
import { AIProvidersManagementPage } from '../dashboard/admin/providers.pages.js';
import { SubscriptionPlansManagementPage } from '../dashboard/admin/plans.pages.js';
import { CreditPackagesManagementPage } from '../dashboard/admin/packages.pages.js';
import { SystemSettingsManagementPage } from '../dashboard/admin/settings.pages.js';

export async function adminRoutes(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Admin login page
  if (path === '/admin' && method === 'GET') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    if (token) {
      const sess = await DB.get(env, `sess:${token}`);
      if (sess && sess.role === 'admin') {
        return Response.redirect(`${url.origin}/admin/dashboard`, 302);
      }
    }
    const { AdminLoginPage } = await import('../auth/auth.pages.js');
    return new Response(AdminLoginPage(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Admin dashboard
  if (path === '/admin/dashboard') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const data = await AdminController.getDashboardData(env);
    return new Response(AdminApp(data), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Handle admin login POST
  if (path === '/admin/login' && method === 'POST') {
    const { user, pass } = await request.json();
    const { AuthService } = await import('../auth/auth.service.js');
    const result = await AuthService.authenticateAdmin(env, user, pass);
    
    if (result.ok) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `adm_t=${result.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
        }
      });
    }
    
    return new Response(JSON.stringify(result), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Admin API routes
  if (path.startsWith('/api/admin/')) {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return new Response(JSON.stringify({ err: 'Unauthorized' }), { status: 401 });
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return new Response(JSON.stringify({ err: 'Unauthorized' }), { status: 401 });
    }

    // Get settings
    if (path === '/api/admin/settings' && method === 'GET') {
      const settings = await AdminController.getDashboardData(env);
      return new Response(JSON.stringify(settings.settings), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update settings
    if (path === '/api/admin/settings' && method === 'POST') {
      const settings = await request.json();
      const result = await AdminController.updateSettings(env, settings);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get Midtrans settings
    if (path === '/api/admin/midtrans' && method === 'GET') {
      const settings = await AdminController.getDashboardData(env);
      return new Response(JSON.stringify({
        server_key: settings.settings.midtrans_server_key || '',
        client_key: settings.settings.midtrans_client_key || '',
        environment: settings.settings.midtrans_environment || 'sandbox'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update Midtrans settings
    if (path === '/api/admin/midtrans' && method === 'POST') {
      const body = await request.json();
      const settings = await AdminController.updateSettings(env, {
        midtrans_server_key: body.server_key,
        midtrans_client_key: body.client_key,
        midtrans_environment: body.environment
      });
      return new Response(JSON.stringify(settings), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get system settings
    if (path === '/api/admin/settings/system' && method === 'GET') {
      const settings = await AdminController.getSystemSettings(env);
      return new Response(JSON.stringify(settings), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update system settings
    if (path === '/api/admin/settings/system' && method === 'POST') {
      const body = await request.json();
      const updates = {};
      
      if (body.admin_user) updates.admin_user = body.admin_user;
      if (body.admin_pass) updates.admin_pass = body.admin_pass;
      if (body.default_credits !== undefined) updates.default_credits = body.default_credits;
      if (body.profit_margin !== undefined) updates.profit_margin = body.profit_margin;
      if (body.idr_rate !== undefined) updates.idr_rate = body.idr_rate;
      if (body.guest_limit !== undefined) updates.guest_limit = body.guest_limit;
      
      const result = await AdminController.updateSettings(env, updates);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get users
    if (path === '/api/admin/users' && method === 'GET') {
      const users = await AdminController.getUsers(env);
      return new Response(JSON.stringify(users), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user logs
    if (path.startsWith('/api/admin/users/') && path.endsWith('/logs') && method === 'GET') {
      const email = path.split('/')[4];
      const logs = await AdminController.getUserLogs(env, email);
      return new Response(JSON.stringify(logs), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user details
    if (path.startsWith('/api/admin/users/') && !path.endsWith('/logs') && !path.endsWith('/credits') && method === 'GET') {
      const email = decodeURIComponent(path.split('/')[4]);
      const userDetails = await AdminController.getUserDetails(env, email);
      if (!userDetails) {
        return new Response(JSON.stringify({ err: 'User not found' }), { status: 404 });
      }
      return new Response(JSON.stringify(userDetails), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete user
    if (path.startsWith('/api/admin/users/') && !path.endsWith('/logs') && !path.endsWith('/credits') && method === 'DELETE') {
      const email = decodeURIComponent(path.split('/')[4]);
      const result = await AdminController.deleteUser(env, email);
      if (result.err) {
        return new Response(JSON.stringify(result), { status: 404 });
      }
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add credits to user
    if (path.startsWith('/api/admin/users/') && path.endsWith('/credits') && method === 'POST') {
      const email = decodeURIComponent(path.split('/')[4]);
      const body = await request.json();
      const result = await AdminController.addCredits(env, email, body.amount);
      if (result.err) {
        return new Response(JSON.stringify(result), { status: 404 });
      }
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // AI Providers API
    if (path === '/api/admin/providers' && method === 'GET') {
      const providers = await AdminController.getAIProviders(env);
      return new Response(JSON.stringify(providers), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/admin/providers' && method === 'POST') {
      const providerData = await request.json();
      const result = await AdminController.addAIProvider(env, providerData);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/admin/providers/') && method === 'PUT') {
      const providerId = decodeURIComponent(path.split('/')[4]);
      const updates = await request.json();
      const result = await AdminController.updateAIProvider(env, providerId, updates);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/admin/providers/') && method === 'DELETE') {
      const providerId = decodeURIComponent(path.split('/')[4]);
      const result = await AdminController.deleteAIProvider(env, providerId);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Subscription Plans API
    if (path === '/api/admin/plans' && method === 'GET') {
      const plans = await AdminController.getSubscriptionPlans(env);
      return new Response(JSON.stringify(plans), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/admin/plans' && method === 'POST') {
      const planData = await request.json();
      const result = await AdminController.addSubscriptionPlan(env, planData);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/admin/plans/') && method === 'PUT') {
      const planId = decodeURIComponent(path.split('/')[4]);
      const updates = await request.json();
      const result = await AdminController.updateSubscriptionPlan(env, planId, updates);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/admin/plans/') && method === 'DELETE') {
      const planId = decodeURIComponent(path.split('/')[4]);
      const result = await AdminController.deleteSubscriptionPlan(env, planId);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Credit Packages API
    if (path === '/api/admin/packages' && method === 'GET') {
      const packages = await AdminController.getCreditPackages(env);
      return new Response(JSON.stringify(packages), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/admin/packages' && method === 'POST') {
      const packageData = await request.json();
      const result = await AdminController.addCreditPackage(env, packageData);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/admin/packages/') && method === 'PUT') {
      const packageId = decodeURIComponent(path.split('/')[4]);
      const updates = await request.json();
      const result = await AdminController.updateCreditPackage(env, packageId, updates);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/admin/packages/') && method === 'DELETE') {
      const packageId = decodeURIComponent(path.split('/')[4]);
      const result = await AdminController.deleteCreditPackage(env, packageId);
      return new Response(JSON.stringify({ ok: result }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // User management page
  if (path.startsWith('/admin/users/') && !path.startsWith('/api/admin/users/') && method === 'GET') {
    const email = decodeURIComponent(path.split('/')[4]);
    const userDetails = await AdminController.getUserDetails(env, email);
    if (!userDetails) {
      return new Response('User not found', { status: 404 });
    }
    return new Response(getUserManagementPage(userDetails), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Users management page
  if (path === '/admin/users' && method === 'GET') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    return new Response(getUsersManagementPage(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // AI Providers management page
  if (path === '/admin/providers' && method === 'GET') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const data = {
      providers: await AdminController.getAIProviders(env)
    };
    
    return new Response(AIProvidersManagementPage(data), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Subscription Plans management page
  if (path === '/admin/plans' && method === 'GET') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const data = {
      plans: await AdminController.getSubscriptionPlans(env)
    };
    
    return new Response(SubscriptionPlansManagementPage(data), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Credit Packages management page
  if (path === '/admin/packages' && method === 'GET') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const data = {
      packages: await AdminController.getCreditPackages(env)
    };
    
    return new Response(CreditPackagesManagementPage(data), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // System Settings management page
  if (path === '/admin/settings' && method === 'GET') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const data = {
      settings: await AdminController.getSystemSettings(env)
    };
    
    return new Response(SystemSettingsManagementPage(data), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Content Management page
  if (path === '/admin/content' && method === 'GET') {
    const cookie = request.headers.get('cookie') || '';
    const token = cookie.split('adm_t=')[1]?.split(';')[0];
    
    if (!token) {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    const sess = await DB.get(env, `sess:${token}`);
    if (!sess || sess.role !== 'admin') {
      return Response.redirect(`${url.origin}/admin`, 302);
    }
    
    return new Response(ContentManagementPage(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Content Management API
  if (path === '/api/admin/content' && method === 'GET') {
    return ContentController.getAllContent(request, env);
  }

  if (path === '/api/admin/content' && method === 'POST') {
    return ContentController.updateContent(request, env);
  }

  if (path.startsWith('/api/admin/content') && method === 'GET') {
    return ContentController.getContent(request, env);
  }

  if (path.startsWith('/api/admin/content') && method === 'DELETE') {
    return ContentController.deleteContent(request, env);
  }

  return new Response('Not Found', { status: 404 });
}

function getUserManagementPage(data) {
  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - Admin Dashboard</title>
    <meta name="description" content="User management for Jasys AI admin dashboard.">
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
    <meta name="theme-color" content="#7c3aed">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    </style>
</head>
<body class="bg-[#020617] text-slate-200 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3 font-bold text-2xl">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                    <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="16" cy="16" r="3" fill="white"/>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                            <stop offset="0%" stop-color="#7c3aed"/>
                            <stop offset="100%" stop-color="#ec4899"/>
                        </linearGradient>
                    </defs>
                </svg> User Management
            </div>
            <div class="hidden md:flex items-center gap-6">
                <a href="/admin/dashboard" class="text-slate-300 hover:text-white transition">Dashboard</a>
                <a href="/admin/users" class="text-white font-bold">Users</a>
                <a href="/admin/providers" class="text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="text-slate-300 hover:text-white transition">Subscription Plans</a>
                <a href="/admin/packages" class="text-slate-300 hover:text-white transition">Credit Packages</a>
                <a href="/admin/content" class="text-slate-300 hover:text-white transition">Content</a>
                <a href="/admin/settings" class="text-slate-300 hover:text-white transition">System Settings</a>
                <button onclick="logout()" class="text-red-500 hover:text-red-400 transition">Logout</button>
            </div>
            <button onclick="toggleMobileMenu()" class="md:hidden text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        <!-- Mobile Menu -->
        <div id="mobileMenu" class="hidden md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800/50">
            <div class="px-6 py-4 space-y-3">
                <a href="/admin/dashboard" class="block text-slate-300 hover:text-white transition">Dashboard</a>
                <a href="/admin/users" class="block text-white font-bold">Users</a>
                <a href="/admin/providers" class="block text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="block text-slate-300 hover:text-white transition">Subscription Plans</a>
                <a href="/admin/packages" class="block text-slate-300 hover:text-white transition">Credit Packages</a>
                <a href="/admin/content" class="block text-slate-300 hover:text-white transition">Content</a>
                <a href="/admin/settings" class="block text-slate-300 hover:text-white transition">System Settings</a>
                <button onclick="logout()" class="text-red-500 hover:text-red-400 block transition">Logout</button>
            </div>
        </div>
    </nav>
    
    <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- User Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-sm font-semibold text-slate-400 mb-2">Email</h3>
                <div class="text-xl font-bold text-white">${data.user.email}</div>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-sm font-semibold text-slate-400 mb-2">Name</h3>
                <div class="text-xl font-bold text-white">${data.user.name}</div>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-sm font-semibold text-slate-400 mb-2">Credits</h3>
                <div class="text-xl font-bold text-blue-400">${data.user.credits}</div>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-sm font-semibold text-slate-400 mb-2">Total Usage</h3>
                <div class="text-xl font-bold text-purple-400">${data.user.total_used}</div>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-sm font-semibold text-slate-400 mb-2">API Keys</h3>
                <div class="text-xl font-bold text-green-400">${data.user.api_keys?.length || 0}</div>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-sm font-semibold text-slate-400 mb-2">Unlocked Models</h3>
                <div class="text-xl font-bold text-yellow-400">${data.user.unlocked_models?.length || 0}</div>
            </div>
        </div>
        
        <!-- API Keys Section -->
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] mb-8">
            <h2 class="text-2xl font-bold text-white mb-6">API Keys</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th class="p-5">Key</th>
                            <th class="p-5">Name</th>
                            <th class="p-5">Created</th>
                            <th class="p-5">Last Used</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                        ${(data.user.api_keys || []).map(key => `
                            <tr>
                                <td class="p-5 text-white">${key.key}</td>
                                <td class="p-5 text-white">${key.name}</td>
                                <td class="p-5 text-slate-400">${new Date(key.created).toLocaleDateString()}</td>
                                <td class="p-5 text-slate-400">${key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Usage History Section -->
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] mb-8">
            <h2 class="text-2xl font-bold text-white mb-6">Usage History</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th class="p-5">Date</th>
                            <th class="p-5">Model</th>
                            <th class="p-5">Cost (IDR)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                        ${data.logs.map(log => `
                            <tr>
                                <td class="p-5 text-slate-400">${new Date(log.time).toLocaleString()}</td>
                                <td class="p-5 text-white">${log.model}</td>
                                <td class="p-5 text-green-400">${log.cost ? log.cost.toFixed(2) : '0'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Actions Section -->
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
            <h2 class="text-2xl font-bold text-white mb-6">Actions</h2>
            <div class="flex flex-col md:flex-row gap-4">
                <button class="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition" onclick="addCredits()">Add Credits</button>
                <button class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition" onclick="deleteUser()">Delete User</button>
                <button class="bg-slate-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition" onclick="location.href='/admin/users'">Back to Users</button>
            </div>
        </div>
    </div>
    
    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function logout() {
            localStorage.clear();
            location.href = '/admin';
        }

        function addCredits() {
            const amount = prompt('Enter number of credits to add:');
            if (amount && !isNaN(amount)) {
                fetch('/api/admin/users/${encodeURIComponent(data.user.email)}/credits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: parseInt(amount) })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('Credits added successfully');
                        location.reload();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }
        
        function deleteUser() {
            if (confirm('Are you sure you want to delete this user?')) {
                fetch('/api/admin/users/${encodeURIComponent(data.user.email)}', {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('User deleted successfully');
                        location.href = '/admin/users';
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }
    </script>
</body>
</html>
  `;
}

function getUsersManagementPage() {
  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users Management - Admin Dashboard</title>
    <meta name="description" content="Users management for Jasys AI admin dashboard.">
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
    <meta name="theme-color" content="#7c3aed">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    </style>
</head>
<body class="bg-[#020617] text-slate-200 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3 font-bold text-2xl">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                    <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="16" cy="16" r="3" fill="white"/>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                            <stop offset="0%" stop-color="#7c3aed"/>
                            <stop offset="100%" stop-color="#ec4899"/>
                        </linearGradient>
                    </defs>
                </svg> Users Management
            </div>
            <div class="hidden md:flex items-center gap-6">
                <a href="/admin/dashboard" class="text-slate-300 hover:text-white transition">Dashboard</a>
                <a href="/admin/users" class="text-white font-bold">Users</a>
                <a href="/admin/providers" class="text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="text-slate-300 hover:text-white transition">Subscription Plans</a>
                <a href="/admin/packages" class="text-slate-300 hover:text-white transition">Credit Packages</a>
                <a href="/admin/content" class="text-slate-300 hover:text-white transition">Content</a>
                <a href="/admin/settings" class="text-slate-300 hover:text-white transition">System Settings</a>
                <button onclick="logout()" class="text-red-500 hover:text-red-400 transition">Logout</button>
            </div>
            <button onclick="toggleMobileMenu()" class="md:hidden text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        <!-- Mobile Menu -->
        <div id="mobileMenu" class="hidden md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800/50">
            <div class="px-6 py-4 space-y-3">
                <a href="/admin/dashboard" class="block text-slate-300 hover:text-white transition">Dashboard</a>
                <a href="/admin/users" class="block text-white font-bold">Users</a>
                <a href="/admin/providers" class="block text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="block text-slate-300 hover:text-white transition">Subscription Plans</a>
                <a href="/admin/packages" class="block text-slate-300 hover:text-white transition">Credit Packages</a>
                <a href="/admin/content" class="block text-slate-300 hover:text-white transition">Content</a>
                <a href="/admin/settings" class="block text-slate-300 hover:text-white transition">System Settings</a>
                <button onclick="logout()" class="text-red-500 hover:text-red-400 block transition">Logout</button>
            </div>
        </div>
    </nav>
    
    <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 class="text-2xl font-bold text-white">Users</h2>
            </div>
            
            <input type="text" id="userSearch" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none mb-6" placeholder="Search users by email or name...">
            
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th class="p-5">Email</th>
                            <th class="p-5">Name</th>
                            <th class="p-5">Credits</th>
                            <th class="p-5">Usage</th>
                            <th class="p-5">Created</th>
                            <th class="p-5">API Keys</th>
                            <th class="p-5">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody" class="divide-y divide-slate-800">
                        <!-- User data will be loaded dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function logout() {
            localStorage.clear();
            location.href = '/admin';
        }

        // Load users on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadUsers();
        });
        
        function loadUsers() {
            fetch('/api/admin/users')
                .then(res => res.json())
                .then(users => {
                    const tbody = document.getElementById('userTableBody');
                    tbody.innerHTML = users.map(user => \`
                        <tr>
                            <td class="p-5 text-white">\${user.email}</td>
                            <td class="p-5 text-white">\${user.name}</td>
                            <td class="p-5 text-blue-400">\${user.credits}</td>
                            <td class="p-5 text-purple-400">\${user.total_used}</td>
                            <td class="p-5 text-slate-400">\${new Date(user.created).toLocaleDateString()}</td>
                            <td class="p-5 text-green-400">\${user.api_keys_count}</td>
                            <td class="p-5">
                                <button class="bg-brand text-white px-4 py-2 rounded-xl font-bold hover:bg-brand/90 transition mr-2" onclick="viewUser('\${user.email}')">View</button>
                                <button class="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-500 transition mr-2" onclick="addCredits('\${user.email}')">Add Credits</button>
                                <button class="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-500 transition" onclick="deleteUser('\${user.email}')">Delete</button>
                            </td>
                        </tr>
                    \`).join('');
                })
                .catch(error => {
                    console.error('Error loading users:', error);
                });
        }
        
        function viewUser(email) {
            location.href = '/admin/users/' + encodeURIComponent(email);
        }
        
        function addCredits(email) {
            const amount = prompt('Enter number of credits to add:');
            if (amount && !isNaN(amount)) {
                fetch('/api/admin/users/' + encodeURIComponent(email) + '/credits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: parseInt(amount) })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('Credits added successfully');
                        loadUsers();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }
        
        function deleteUser(email) {
            if (confirm('Are you sure you want to delete this user?')) {
                fetch('/api/admin/users/' + encodeURIComponent(email), {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('User deleted successfully');
                        loadUsers();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }
        
        // Search functionality
        document.getElementById('userSearch').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.getElementById('userTableBody').querySelectorAll('tr');
            
            rows.forEach(row => {
                const email = row.cells[0].textContent.toLowerCase();
                const name = row.cells[1].textContent.toLowerCase();
                const matchesSearch = email.includes(searchTerm) || name.includes(searchTerm);
                row.style.display = matchesSearch ? '' : 'none';
            });
        });
    </script>
</body>
</html>
  `;
}
