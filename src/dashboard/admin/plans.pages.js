import { LOGO_SVG } from '../../utils/assets.js';

export function SubscriptionPlansManagementPage(data) {
  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Plans - Admin Dashboard</title>
    <meta name="description" content="Subscription Plans management for Jasys AI admin dashboard.">
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
    <meta name="theme-color" content="#7c3aed">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; }
        .modal.active { display: flex; align-items: center; justify-content: center; }
        .modal-content { background: #0f172a; border: 1px solid #1e293b; border-radius: 1rem; padding: 2rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .modal-header h3 { color: white; font-size: 1.25rem; }
        .modal-close { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.5rem; }
        .tag { display: inline-block; background: #1e293b; color: #60a5fa; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; margin-right: 0.25rem; margin-bottom: 0.25rem; }
        .tag-remove { margin-left: 0.25rem; cursor: pointer; color: #ef4444; }
        .feature-input { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    </style>
</head>
<body class="bg-[#020617] text-slate-200 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3 font-bold text-2xl">
                ${LOGO_SVG} Subscription Plans
            </div>
            <div class="hidden md:flex items-center gap-6">
                <a href="/admin/dashboard" class="text-slate-300 hover:text-white transition">Dashboard</a>
                <a href="/admin/users" class="text-slate-300 hover:text-white transition">Users</a>
                <a href="/admin/providers" class="text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="text-white font-bold">Subscription Plans</a>
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
                <a href="/admin/providers" class="block text-slate-300 hover:text-white transition">AI Providers</a>
                <a href="/admin/plans" class="block text-white font-bold">Subscription Plans</a>
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
                <h2 class="text-2xl font-bold text-white">Subscription Plans</h2>
                <button class="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition" onclick="openAddModal()">Add Plan</button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th class="p-5">ID</th>
                            <th class="p-5">Name</th>
                            <th class="p-5">Price (IDR)</th>
                            <th class="p-5">Credits</th>
                            <th class="p-5">Users</th>
                            <th class="p-5">Features</th>
                            <th class="p-5">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="plansTableBody" class="divide-y divide-slate-800">
                        ${(data.plans || []).map(plan => `
                            <tr>
                                <td class="p-5 text-white">${plan.id}</td>
                                <td class="p-5 text-white">${plan.name}</td>
                                <td class="p-5 text-green-400">${plan.price.toLocaleString('id-ID')}</td>
                                <td class="p-5 text-blue-400">${plan.credits.toLocaleString('id-ID')}</td>
                                <td class="p-5 text-white">${plan.users}</td>
                                <td class="p-5">
                                    ${(plan.features || []).slice(0, 3).map(f => `<span class="tag">${f}</span>`).join('')}
                                    ${(plan.features || []).length > 3 ? '...' : ''}
                                </td>
                                <td class="p-5">
                                    <button class="bg-brand text-white px-4 py-2 rounded-xl font-bold hover:bg-brand/90 transition mr-2" onclick="editPlan('${plan.id}')">Edit</button>
                                    <button class="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-500 transition" onclick="deletePlan('${plan.id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Add Plan Modal -->
    <div id="addPlanModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Subscription Plan</h3>
                <button class="modal-close" onclick="closeAddModal()">&times;</button>
            </div>
            <form id="addPlanForm" onsubmit="addPlan(event)">
                <div class="mb-6">
                    <label for="planId" class="block text-sm font-semibold text-slate-400 mb-2">Plan ID</label>
                    <input type="text" id="planId" name="id" required placeholder="e.g. pro" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="planName" class="block text-sm font-semibold text-slate-400 mb-2">Plan Name</label>
                    <input type="text" id="planName" name="name" required placeholder="e.g. Pro Plan" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="planPrice" class="block text-sm font-semibold text-slate-400 mb-2">Price (IDR)</label>
                    <input type="number" id="planPrice" name="price" required min="0" placeholder="e.g. 99000" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="planCredits" class="block text-sm font-semibold text-slate-400 mb-2">Monthly Credits</label>
                    <input type="number" id="planCredits" name="credits" required min="0" placeholder="e.g. 50000" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="planUsers" class="block text-sm font-semibold text-slate-400 mb-2">Max Users</label>
                    <input type="number" id="planUsers" name="users" required min="1" placeholder="e.g. 5" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-400 mb-2">Features</label>
                    <div id="addFeaturesContainer">
                        <div class="feature-input">
                            <input type="text" class="feature-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" placeholder="Enter feature">
                            <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
                        </div>
                    </div>
                    <button type="button" class="mt-2 px-4 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition" onclick="addFeatureInput('add')">Add Feature</button>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-400 mb-2">Available Models</label>
                    <div id="addModelsContainer">
                        <div class="feature-input">
                            <input type="text" class="model-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" placeholder="Enter model ID">
                            <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
                        </div>
                    </div>
                    <button type="button" class="mt-2 px-4 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition" onclick="addModelInput('add')">Add Model</button>
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition">Add Plan</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Edit Plan Modal -->
    <div id="editPlanModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Subscription Plan</h3>
                <button class="modal-close" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editPlanForm" onsubmit="updatePlan(event)">
                <input type="hidden" id="editPlanId">
                <div class="mb-6">
                    <label for="editPlanName" class="block text-sm font-semibold text-slate-400 mb-2">Plan Name</label>
                    <input type="text" id="editPlanName" name="name" required class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="editPlanPrice" class="block text-sm font-semibold text-slate-400 mb-2">Price (IDR)</label>
                    <input type="number" id="editPlanPrice" name="price" required min="0" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="editPlanCredits" class="block text-sm font-semibold text-slate-400 mb-2">Monthly Credits</label>
                    <input type="number" id="editPlanCredits" name="credits" required min="0" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="editPlanUsers" class="block text-sm font-semibold text-slate-400 mb-2">Max Users</label>
                    <input type="number" id="editPlanUsers" name="users" required min="1" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:border-brand focus:outline-none">
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-400 mb-2">Features</label>
                    <div id="editFeaturesContainer"></div>
                    <button type="button" class="mt-2 px-4 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition" onclick="addFeatureInput('edit')">Add Feature</button>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-400 mb-2">Available Models</label>
                    <div id="editModelsContainer"></div>
                    <button type="button" class="mt-2 px-4 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition" onclick="addModelInput('edit')">Add Model</button>
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition" onclick="closeEditModal()">Cancel</button>
                    <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition">Update Plan</button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        // Load plans data
        let plansData = ${JSON.stringify(data.plans || [])};
        
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function logout() {
            localStorage.clear();
            location.href = '/admin';
        }
        
        function openAddModal() {
            document.getElementById('addPlanModal').classList.add('active');
            document.getElementById('addPlanForm').reset();
            document.getElementById('addFeaturesContainer').innerHTML = \`
                <div class="feature-input">
                    <input type="text" class="feature-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" placeholder="Enter feature">
                    <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
                </div>
            \`;
            document.getElementById('addModelsContainer').innerHTML = \`
                <div class="feature-input">
                    <input type="text" class="model-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" placeholder="Enter model ID">
                    <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
                </div>
            \`;
        }
        
        function closeAddModal() {
            document.getElementById('addPlanModal').classList.remove('active');
        }
        
        function openEditModal() {
            document.getElementById('editPlanModal').classList.add('active');
        }
        
        function closeEditModal() {
            document.getElementById('editPlanModal').classList.remove('active');
        }
        
        function addFeatureInput(formType) {
            const container = document.getElementById(formType === 'add' ? 'addFeaturesContainer' : 'editFeaturesContainer');
            const inputDiv = document.createElement('div');
            inputDiv.className = 'feature-input';
            inputDiv.innerHTML = \`
                <input type="text" class="feature-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" placeholder="Enter feature">
                <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
            \`;
            container.appendChild(inputDiv);
        }
        
        function addModelInput(formType) {
            const container = document.getElementById(formType === 'add' ? 'addModelsContainer' : 'editModelsContainer');
            const inputDiv = document.createElement('div');
            inputDiv.className = 'feature-input';
            inputDiv.innerHTML = \`
                <input type="text" class="model-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" placeholder="Enter model ID">
                <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
            \`;
            container.appendChild(inputDiv);
        }
        
        function editPlan(planId) {
            const plan = plansData.find(p => p.id === planId);
            if (!plan) return;
            
            document.getElementById('editPlanId').value = plan.id;
            document.getElementById('editPlanName').value = plan.name;
            document.getElementById('editPlanPrice').value = plan.price;
            document.getElementById('editPlanCredits').value = plan.credits;
            document.getElementById('editPlanUsers').value = plan.users;
            
            // Load features
            const featuresContainer = document.getElementById('editFeaturesContainer');
            featuresContainer.innerHTML = (plan.features || []).map(f => \`
                <div class="feature-input">
                    <input type="text" class="feature-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" value="\${f}">
                    <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
                </div>
            \`).join('');
            
            // Load available models
            const modelsContainer = document.getElementById('editModelsContainer');
            modelsContainer.innerHTML = (plan.available_models || []).map(m => \`
                <div class="feature-input">
                    <input type="text" class="model-input flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:border-brand focus:outline-none" value="\${m}">
                    <button type="button" class="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-500 transition" onclick="this.parentElement.remove()">×</button>
                </div>
            \`).join('');
            
            openEditModal();
        }
        
        async function addPlan(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const features = Array.from(document.querySelectorAll('#addFeaturesContainer .feature-input'))
                .map(input => input.querySelector('.feature-input').value.trim())
                .filter(f => f);
            const availableModels = Array.from(document.querySelectorAll('#addModelsContainer .model-input'))
                .map(input => input.value.trim())
                .filter(m => m);
            
            const plan = {
                id: formData.get('id'),
                name: formData.get('name'),
                price: parseInt(formData.get('price')),
                credits: parseInt(formData.get('credits')),
                users: parseInt(formData.get('users')),
                features: features,
                available_models: availableModels
            };
            
            try {
                const response = await fetch('/api/admin/plans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(plan)
                });
                
                const data = await response.json();
                if (data.ok) {
                    alert('Plan added successfully');
                    closeAddModal();
                    location.reload();
                } else {
                    alert('Error: ' + (data.err || 'Failed to add plan'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding plan');
            }
        }
        
        async function updatePlan(event) {
            event.preventDefault();
            
            const planId = document.getElementById('editPlanId').value;
            const formData = new FormData(event.target);
            const features = Array.from(document.querySelectorAll('#editFeaturesContainer .feature-input'))
                .map(input => input.querySelector('.feature-input').value.trim())
                .filter(f => f);
            const availableModels = Array.from(document.querySelectorAll('#editModelsContainer .model-input'))
                .map(input => input.value.trim())
                .filter(m => m);
            
            const updates = {
                name: formData.get('name'),
                price: parseInt(formData.get('price')),
                credits: parseInt(formData.get('credits')),
                users: parseInt(formData.get('users')),
                features: features,
                available_models: availableModels
            };
            
            try {
                const response = await fetch('/api/admin/plans/' + encodeURIComponent(planId), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
                
                const data = await response.json();
                if (data.ok) {
                    alert('Plan updated successfully');
                    closeEditModal();
                    location.reload();
                } else {
                    alert('Error: ' + (data.err || 'Failed to update plan'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating plan');
            }
        }
        
        async function deletePlan(planId) {
            if (!confirm('Are you sure you want to delete this plan?')) {
                return;
            }
            
            try {
                const response = await fetch('/api/admin/plans/' + encodeURIComponent(planId), {
                    method: 'DELETE'
                });
                
                const data = await response.json();
                if (data.ok) {
                    alert('Plan deleted successfully');
                    location.reload();
                } else {
                    alert('Error: ' + (data.err || 'Failed to delete plan'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting plan');
            }
        }
    </script>
</body>
</html>
  `;
}
