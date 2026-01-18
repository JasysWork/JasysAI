import { DB } from '../db/index.js';
import { AuthService } from '../auth/auth.service.js';
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

  // Static assets
  if (path.startsWith('/assets/')) {
    return new Response('Asset not found', { status: 404 });
  }

  // Authentication routes
  if (path.startsWith('/auth/') || path === '/') {
    return authRoutes(request, env);
  }

  // Admin routes
  if (path.startsWith('/admin')) {
    return adminRoutes(request, env);
  }

  // User dashboard routes
  if (path.startsWith('/app/') || path === '/app') {
    return userRoutes(request, env);
  }

  // API routes
  if (path.startsWith('/api/')) {
    return apiRoutes(request, env);
  }

  // Chat interface
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
    return new Response(getChatHTML(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // 404
  return new Response('Not Found', { status: 404 });
}

function getChatHTML() {
  return `
<!DOCTYPE html><html lang="en" class="dark"><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-[#020617] text-slate-200 min-h-screen flex flex-col">
  <div class="flex-1 flex">
    <div class="w-64 bg-slate-900 border-r border-slate-800 p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Chat History</h2>
        <button onclick="newChat()" class="text-brand hover:text-brand/80">New</button>
      </div>
      <div id="chatList" class="space-y-2">
        <!-- Chat history loaded here -->
      </div>
    </div>
    
    <div class="flex-1 flex flex-col">
      <div class="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-white">AI Assistant</h1>
        <button onclick="location.href='/app'" class="text-slate-400 hover:text-white">Dashboard</button>
      </div>
      
      <div id="chatMessages" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div class="text-center text-slate-500 py-8">Start a conversation...</div>
      </div>
      
      <div class="bg-slate-900 border-t border-slate-800 p-4">
        <div class="flex gap-4">
          <input id="messageInput" type="text" placeholder="Type your message..." 
                 class="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white focus:border-brand focus:outline-none"
                 onkeypress="if(event.key==='Enter') sendMessage()">
          <button onclick="sendMessage()" class="bg-brand px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition">Send</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentChatId = null;
    
    async function loadChatHistory() {
      const res = await fetch('/api/user/history', { headers: { 'Authorization': localStorage.getItem('t') } });
      if (res.ok) {
        const history = await res.json();
        const list = document.getElementById('chatList');
        list.innerHTML = history.map(h => \`
          <div class="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer" onclick="loadChat('\${h.id}')">
            <div class="text-sm font-medium text-white">\${h.title}</div>
            <div class="text-xs text-slate-500">\${new Date(h.date).toLocaleDateString()}</div>
          </div>
        \`).join('');
      }
    }
    
    function newChat() {
      currentChatId = 'chat_' + Date.now();
      document.getElementById('chatMessages').innerHTML = '<div class="text-center text-slate-500 py-8">Start a conversation...</div>';
    }
    
    async function sendMessage() {
      const input = document.getElementById('messageInput');
      const message = input.value.trim();
      if (!message) return;
      
      if (!currentChatId) newChat();
      
      const messagesDiv = document.getElementById('chatMessages');
      messagesDiv.innerHTML += \`
        <div class="flex justify-end">
          <div class="bg-brand p-4 rounded-2xl max-w-md text-white">\${message}</div>
        </div>
      \`;
      
      input.value = '';
      
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Authorization': localStorage.getItem('t'), 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, chatId: currentChatId })
        });
        
        const data = await res.json();
        if (data.ok) {
          messagesDiv.innerHTML += \`
            <div class="flex justify-start">
              <div class="bg-slate-800 p-4 rounded-2xl max-w-md text-white">\${data.response}</div>
            </div>
          \`;
        } else {
          messagesDiv.innerHTML += \`
            <div class="flex justify-start">
              <div class="bg-red-900 p-4 rounded-2xl max-w-md text-white">Error: \${data.err}</div>
            </div>
          \`;
        }
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      } catch (error) {
        messagesDiv.innerHTML += \`
          <div class="flex justify-start">
            <div class="bg-red-900 p-4 rounded-2xl max-w-md text-white">Connection error</div>
          </div>
        \`;
      }
    }
    
    loadChatHistory();
  </script>
</body></html>`;
}