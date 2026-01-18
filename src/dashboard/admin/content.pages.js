export function ContentManagementPage() {
  return `
<!DOCTYPE html><html lang="en" class="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-slate-900 text-slate-200 min-h-screen">
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-slate-800 border-r border-slate-700">
      <div class="p-6">
        <h2 class="text-xl font-bold text-white mb-6">Admin Panel</h2>
        <nav class="space-y-2">
          <a href="/admin" class="block px-4 py-2 rounded-lg bg-slate-700 text-white">Dashboard</a>
          <a href="/admin/users" class="block px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-300">Users</a>
          <a href="/admin/api-keys" class="block px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-300">API Keys</a>
          <a href="/admin/content" class="block px-4 py-2 rounded-lg bg-brand text-white">Content</a>
          <a href="/admin/settings" class="block px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-300">Settings</a>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Content Management</h1>
          <button onclick="location.href='/admin'" class="text-slate-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 class="text-lg font-semibold text-white mb-2">Total Pages</h3>
              <p class="text-3xl font-bold text-brand" id="totalPages">6</p>
            </div>
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 class="text-lg font-semibold text-white mb-2">Published</h3>
              <p class="text-3xl font-bold text-green-400" id="publishedPages">0</p>
            </div>
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 class="text-lg font-semibold text-white mb-2">Last Updated</h3>
              <p class="text-lg text-slate-400" id="lastUpdated">Never</p>
            </div>
          </div>

          <!-- Content Editor -->
          <div class="bg-slate-800 rounded-xl border border-slate-700">
            <div class="p-6 border-b border-slate-700">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-white">Edit Content</h2>
                <select id="pageSelector" onchange="loadPage()" class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
                  <option value="">Select a page...</option>
                  <option value="about">About</option>
                  <option value="blog">Blog</option>
                  <option value="contact">Contact</option>
                  <option value="privacy_policy">Privacy Policy</option>
                  <option value="terms_of_service">Terms of Service</option>
                  <option value="security">Security</option>
                </select>
              </div>
            </div>

            <div class="p-6">
              <div id="editorContainer" class="hidden">
                <div class="mb-6">
                  <label class="block text-sm font-medium text-slate-300 mb-2">Page Title</label>
                  <input type="text" id="pageTitle" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-brand focus:outline-none">
                </div>

                <div class="mb-6">
                  <label class="block text-sm font-medium text-slate-300 mb-2">Content</label>
                  <textarea id="pageContent" rows="12" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-brand focus:outline-none" placeholder="Enter your content here..."></textarea>
                  <p class="text-xs text-slate-500 mt-2">You can use HTML tags for formatting.</p>
                </div>

                <div class="flex justify-between items-center">
                  <div class="text-sm text-slate-400" id="lastUpdatedInfo"></div>
                  <div class="space-x-4">
                    <button onclick="previewContent()" class="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition">Preview</button>
                    <button onclick="saveContent()" class="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition">Save Changes</button>
                  </div>
                </div>
              </div>

              <div id="placeholderMessage" class="text-center py-12">
                <svg class="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <h3 class="text-lg font-medium text-white mb-2">Select a page to edit</h3>
                <p class="text-slate-400">Choose a page from the dropdown above to start editing its content.</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-8 bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onclick="viewAllPages()" class="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition text-left">
                <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <div>
                  <div class="font-medium text-white">View All Pages</div>
                  <div class="text-sm text-slate-400">See how pages look to visitors</div>
                </div>
              </button>
              
              <button onclick="exportContent()" class="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition text-left">
                <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <div class="font-medium text-white">Export Content</div>
                  <div class="text-sm text-slate-400">Download all content as JSON</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <script>
    let currentContent = {};

    async function loadAllContent() {
      try {
        const response = await fetch('/admin/api/content');
        const result = await response.json();
        
        if (result.ok) {
          currentContent = result.data;
          updateStats();
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    }

    async function loadPage() {
      const selector = document.getElementById('pageSelector');
      const selectedKey = selector.value;
      
      if (!selectedKey) {
        document.getElementById('editorContainer').classList.add('hidden');
        document.getElementById('placeholderMessage').classList.remove('hidden');
        return;
      }

      try {
        const response = await fetch(\`/admin/api/content?key=\${selectedKey}\`);
        const result = await response.json();
        
        if (result.ok) {
          const content = result.data;
          document.getElementById('pageTitle').value = content.title || '';
          document.getElementById('pageContent').value = content.content || '';
          
          if (content.last_updated) {
            document.getElementById('lastUpdatedInfo').textContent = 
              \`Last updated: \${new Date(content.last_updated).toLocaleString()}\`;
          } else {
            document.getElementById('lastUpdatedInfo').textContent = 'Never updated';
          }
          
          document.getElementById('editorContainer').classList.remove('hidden');
          document.getElementById('placeholderMessage').classList.add('hidden');
        }
      } catch (error) {
        console.error('Error loading page:', error);
        alert('Error loading page content');
      }
    }

    async function saveContent() {
      const selectedKey = document.getElementById('pageSelector').value;
      const title = document.getElementById('pageTitle').value;
      const content = document.getElementById('pageContent').value;
      
      if (!selectedKey) {
        alert('Please select a page first');
        return;
      }

      try {
        const response = await fetch('/admin/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: selectedKey, title, content })
        });
        
        const result = await response.json();
        
        if (result.ok) {
          alert('Content saved successfully!');
          loadAllContent();
          loadPage(); // Reload to show updated timestamp
        } else {
          alert('Error saving content: ' + result.err);
        }
      } catch (error) {
        console.error('Error saving content:', error);
        alert('Error saving content');
      }
    }

    function previewContent() {
      const selectedKey = document.getElementById('pageSelector').value;
      if (selectedKey) {
        window.open('/' + selectedKey.replace('_', '-'), '_blank');
      }
    }

    function viewAllPages() {
      const pages = ['about', 'blog', 'contact', 'privacy-policy', 'terms-of-service', 'security'];
      pages.forEach(page => {
        setTimeout(() => window.open('/' + page, '_blank'), 100);
      });
    }

    async function exportContent() {
      try {
        const response = await fetch('/admin/api/content');
        const result = await response.json();
        
        if (result.ok) {
          const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'content-export-' + new Date().toISOString().split('T')[0] + '.json';
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Error exporting content:', error);
        alert('Error exporting content');
      }
    }

    function updateStats() {
      const total = Object.keys(currentContent).length;
      const published = Object.values(currentContent).filter(content => content.content && content.content.trim()).length;
      const lastUpdated = Object.values(currentContent)
        .filter(content => content.last_updated)
        .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))[0];
      
      document.getElementById('totalPages').textContent = total;
      document.getElementById('publishedPages').textContent = published;
      document.getElementById('lastUpdated').textContent = lastUpdated ? 
        new Date(lastUpdated.last_updated).toLocaleDateString() : 'Never';
    }

    // Load content when page loads
    loadAllContent();
  </script>
</body></html>`;
}