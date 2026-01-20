import { LOGO_SVG } from '../../utils/assets.js';

export function AIProvidersManagementPage(data) {
  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Providers - Admin Dashboard</title>
    <meta name="description" content="AI Providers management for Jasys AI admin dashboard.">
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
    <meta name="theme-color" content="#7c3aed">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; }
        .modal.active { display: flex; align-items: center; justify-content: center; }
        .modal-content { background: #0f172a; border: 1px solid #1e293b; border-radius: 1rem; padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .modal-header h3 { color: white; font-size: 1.25rem; }
        .modal-close { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.5rem; }
        .status-badge { padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500; }
        .status-active { background: #10b981; color: white; }
        .status-inactive { background: #64748b; color: white; }
    </style>
</head>
<body class="bg-[#020617] text-slate-200 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3 font-bold text-2xl">
                ${LOGO_SVG} AI Providers
            </div>
            <div class="hidden md:flex items-center gap-6">
                <a href="/admin/dashboard" class="text-slate-300 hover:text-white transition">Dashboard</a>
                <a href="/admin/users" class="text-slate-300 hover:text-white transition">Users</a>
                <a href="/admin/providers" class="text-white font-bold">AI Providers</a>
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
                <a href="/admin/users" class="block text-slate-300 hover:text-white transition">Users</a>
                <a href="/admin/providers" class="block text-white font-bold">AI Providers</a>
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
                <h2 class="text-2xl font-bold text-white">AI Providers</h2>
                <button class="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition" onclick="openAddModal()">Add Provider</button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th class="p-5">ID</th>
                            <th class="p-5">Name</th>
                            <th class="p-5">Endpoint</th>
                            <th class="p-5">Status</th>
                            <th class="p-5">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="providersTableBody" class="divide-y divide-slate-800">
                        ${(data.providers || []).map(provider => `
                            <tr>
                                <td class="p-5 text-white">${provider.id}</td>
                                <td class="p-5 text-white">${provider.name}</td>
                                <td class="p-5 text-blue-400">${provider.endpoint}</td>
                                <td class="p-5"><span class="status-badge ${provider.active ? 'status-active' : 'status-inactive'}">${provider.active ? 'Active' : 'Inactive'}</span></td>
                                <td class="p-5">
                                    <button class="bg-brand text-white px-4 py-2 rounded-xl font-bold hover:bg-brand/90 transition mr-2" onclick="editProvider('${provider.id}')">Edit</button>
                                    <button class="bg-${provider.active ? 'red' : 'green'}-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-${provider.active ? 'red' : 'green'}-500 transition mr-2" onclick="toggleProvider('${provider.id}')">${provider.active ? 'Deactivate' : 'Activate'}</button>
                                    <button class="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-500 transition" onclick="deleteProvider('${provider.id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Add Provider Modal -->
    <div id="addProviderModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add AI Provider</h3>
                <button class="modal-close" onclick="closeAddModal()">&times;</button>
            </div>
            <form id="addProviderForm" onsubmit="addProvider(event)">
                <div class="mb-6">
                    <label for="providerId" class="block text-sm font-semibold text-slate-400 mb-2">Provider ID</label>
                    <input type="text" id="providerId" name="id" required placeholder="e.g. openrouter" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="providerName" class="block text-sm font-semibold text-slate-400 mb-2">Name</label>
                    <input type="text" id="providerName" name="name" required placeholder="e.g. OpenRouter" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="providerEndpoint" class="block text-sm font-semibold text-slate-400 mb-2">API Endpoint</label>
                    <input type="text" id="providerEndpoint" name="endpoint" required placeholder="e.g. https://openrouter.ai/api/v1" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="providerApiKey" class="block text-sm font-semibold text-slate-400 mb-2">API Key</label>
                    <input type="password" id="providerApiKey" name="api_key" placeholder="Enter API key" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="providerActive" class="block text-sm font-semibold text-slate-400 mb-2">Active</label>
                    <select id="providerActive" name="active" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition">Add Provider</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Edit Provider Modal -->
    <div id="editProviderModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit AI Provider</h3>
                <button class="modal-close" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editProviderForm" onsubmit="updateProvider(event)">
                <input type="hidden" id="editProviderId">
                <div class="mb-6">
                    <label for="editProviderName" class="block text-sm font-semibold text-slate-400 mb-2">Name</label>
                    <input type="text" id="editProviderName" name="name" required class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="editProviderEndpoint" class="block text-sm font-semibold text-slate-400 mb-2">API Endpoint</label>
                    <input type="text" id="editProviderEndpoint" name="endpoint" required class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="editProviderApiKey" class="block text-sm font-semibold text-slate-400 mb-2">API Key</label>
                    <input type="password" id="editProviderApiKey" name="api_key" placeholder="Leave empty to keep current" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="editProviderActive" class="block text-sm font-semibold text-slate-400 mb-2">Active</label>
                    <select id="editProviderActive" name="active" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition" onclick="closeEditModal()">Cancel</button>
                    <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition">Update Provider</button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        // Load providers data
        let providersData = ${JSON.stringify(data.providers || [])};
        
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function logout() {
            localStorage.clear();
            location.href = '/admin';
        }
        
        function openAddModal() {
            document.getElementById('addProviderModal').classList.add('active');
            document.getElementById('addProviderForm').reset();
        }
        
        function closeAddModal() {
            document.getElementById('addProviderModal').classList.remove('active');
        }
        
        function openEditModal() {
            document.getElementById('editProviderModal').classList.add('active');
        }
        
        function closeEditModal() {
            document.getElementById('editProviderModal').classList.remove('active');
        }
        
        function editProvider(providerId) {
            const provider = providersData.find(p => p.id === providerId);
            if (!provider) return;
            
            document.getElementById('editProviderId').value = provider.id;
            document.getElementById('editProviderName').value = provider.name;
            document.getElementById('editProviderEndpoint').value = provider.endpoint;
            document.getElementById('editProviderApiKey').value = '';
            document.getElementById('editProviderActive').value = provider.active ? 'true' : 'false';
            openEditModal();
        }
        
        async function addProvider(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const provider = {
                id: formData.get('id'),
                name: formData.get('name'),
                endpoint: formData.get('endpoint'),
                api_key: formData.get('api_key'),
                active: formData.get('active') === 'true'
            };
            
            try {
                const response = await fetch('/api/admin/providers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(provider)
                });
                
                const data = await response.json();
                if (data.ok) {
                    alert('Provider added successfully');
                    closeAddModal();
                    location.reload();
                } else {
                    alert('Error: ' + (data.err || 'Failed to add provider'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding provider');
            }
        }
        
        async function updateProvider(event) {
            event.preventDefault();
            
            const providerId = document.getElementById('editProviderId').value;
            const formData = new FormData(event.target);
            const updates = {
                name: formData.get('name'),
                endpoint: formData.get('endpoint'),
                active: formData.get('active') === 'true'
            };
            
            if (formData.get('api_key')) {
                updates.api_key = formData.get('api_key');
            }
            
            try {
                const response = await fetch('/api/admin/providers/' + encodeURIComponent(providerId), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
                
                const data = await response.json();
                if (data.ok) {
                    alert('Provider updated successfully');
                    closeEditModal();
                    location.reload();
                } else {
                    alert('Error: ' + (data.err || 'Failed to update provider'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating provider');
            }
        }
        
        async function deleteProvider(providerId) {
            if (!confirm('Are you sure you want to delete this provider?')) {
                return;
            }
            
            try {
                const response = await fetch('/api/admin/providers/' + encodeURIComponent(providerId), {
                    method: 'DELETE'
                });
                
                const data = await response.json();
                if (data.ok) {
                    alert('Provider deleted successfully');
                    location.reload();
                } else {
                    alert('Error: ' + (data.err || 'Failed to delete provider'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting provider');
            }
        }
        
        async function toggleProvider(providerId) {
            const provider = providersData.find(p => p.id === providerId);
            if (!provider) return;
            
            try {
                const response = await fetch('/api/admin/providers/' + encodeURIComponent(providerId), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ active: !provider.active })
                });
                
                const data = await response.json();
                if (data.ok) {
                    alert('Provider status updated');
                    location.reload();
                } else {
                    alert('Error: ' + (data.err || 'Failed to update provider status'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating provider status');
            }
        }
    </script>
</body>
</html>
  `;
}
