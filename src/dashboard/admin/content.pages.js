import { LOGO_SVG } from '../../utils/assets.js';

export function ContentManagementPage() {
  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Management - Admin Dashboard</title>
    <meta name="description" content="Content management for Jasys AI admin dashboard.">
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
                ${LOGO_SVG} Content Management
            </div>
            <div class="hidden md:flex items-center gap-6">
                <a href="/admin/dashboard" class="text-slate-300 hover:text-white transition">Dashboard</a>
                <a href="/admin/users" class="text-slate-300 hover:text-white transition">Users</a>
                <a href="/admin/providers" class="text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="text-slate-300 hover:text-white transition">Subscription Plans</a>
                <a href="/admin/packages" class="text-slate-300 hover:text-white transition">Credit Packages</a>
                <a href="/admin/content" class="text-white font-bold">Content</a>
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
                <a href="/admin/users" class="block text-slate-300 hover:text-white transition">Users</a>
                <a href="/admin/providers" class="block text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="block text-slate-300 hover:text-white transition">Subscription Plans</a>
                <a href="/admin/packages" class="block text-slate-300 hover:text-white transition">Credit Packages</a>
                <a href="/admin/content" class="block text-white font-bold">Content</a>
                <a href="/admin/settings" class="block text-slate-300 hover:text-white transition">System Settings</a>
                <button onclick="logout()" class="text-red-500 hover:text-red-400 block transition">Logout</button>
            </div>
        </div>
    </nav>

    <div class="max-w-6xl mx-auto px-6 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-lg font-semibold text-slate-400 mb-2">Total Pages</h3>
                <p class="text-3xl font-bold text-brand" id="totalPages">6</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-lg font-semibold text-slate-400 mb-2">Published</h3>
                <p class="text-3xl font-bold text-green-400" id="publishedPages">0</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
                <h3 class="text-lg font-semibold text-slate-400 mb-2">Last Updated</h3>
                <p class="text-lg text-slate-400" id="lastUpdated">Never</p>
            </div>
        </div>

        <!-- Content Editor -->
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-white">Edit Content</h2>
                <select id="pageSelector" onchange="loadPage()" class="bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                    <option value="">Select a page...</option>
                    <option value="about">About</option>
                    <option value="blog">Blog</option>
                    <option value="contact">Contact</option>
                    <option value="privacy_policy">Privacy Policy</option>
                    <option value="terms_of_service">Terms of Service</option>
                    <option value="security">Security</option>
                </select>
            </div>

            <div id="editorContainer" class="hidden">
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-400 mb-2">Page Title</label>
                    <input type="text" id="pageTitle" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-400 mb-2">Content</label>
                    <textarea id="pageContent" rows="12" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none" placeholder="Enter your content here..."></textarea>
                    <p class="text-xs text-slate-500 mt-2">You can use HTML tags for formatting.</p>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm text-slate-400" id="lastUpdatedInfo"></div>
                    <div class="space-x-4">
                        <button onclick="previewContent()" class="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition">Preview</button>
                        <button onclick="saveContent()" class="px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition">Save Changes</button>
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

        <!-- Quick Actions -->
        <div class="mt-8 bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
            <h3 class="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onclick="viewAllPages()" class="flex items-center gap-3 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition text-left">
                    <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <div>
                        <div class="font-medium text-white">View All Pages</div>
                        <div class="text-sm text-slate-400">See how pages look to visitors</div>
                    </div>
                </button>
                
                <button onclick="exportContent()" class="flex items-center gap-3 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition text-left">
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

    <script>
        let currentContent = {};

        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function logout() {
            localStorage.clear();
            location.href = '/admin';
        }

        async function loadAllContent() {
            try {
                const response = await fetch('/api/admin/content');
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
                const response = await fetch(\`/api/admin/content?key=\${selectedKey}\`);
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
                const response = await fetch('/api/admin/content', {
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
                const response = await fetch('/api/admin/content');
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
</body>
</html>`;
}
