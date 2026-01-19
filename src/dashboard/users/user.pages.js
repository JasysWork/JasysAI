export function UserApp(user) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard - JasyAI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; min-height: 100vh; }
        
        /* Sidebar Navigation */
        .sidebar {
            width: 240px;
            background: #1e293b;
            color: white;
            position: fixed;
            height: 100vh;
            padding: 2rem 0;
            overflow-y: auto;
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .sidebar .logo {
            text-align: center;
            padding: 0 2rem 2rem;
            border-bottom: 1px solid #334155;
        }
        
        .sidebar .logo h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .sidebar .logo p { color: #94a3b8; font-size: 0.875rem; }
        
        .nav-menu { list-style: none; padding: 2rem 1rem; }
        .nav-menu li { margin-bottom: 0.5rem; }
        .nav-menu a {
            display: block;
            padding: 0.75rem 1rem;
            color: #94a3b8;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s;
            font-size: 0.875rem;
        }
        .nav-menu a:hover, .nav-menu a.active {
            background: #334155;
            color: white;
        }
        
        /* Main Content */
        .main-content {
            margin-left: 240px;
            padding: 2rem;
        }
        
        /* Header */
        .header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-radius: 8px;
        }
        
        .header h2 { color: #1e293b; font-size: 1.5rem; }
        .user-profile {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .user-info {
            text-align: right;
        }
        .user-info .name { font-weight: 600; color: #1e293b; }
        .user-info .email { color: #64748b; font-size: 0.875rem; }
        
        /* Dashboard Stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .stat-card h3 { color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .stat-card .value { color: #1e293b; font-size: 2rem; font-weight: 600; }
        .stat-card .trend {
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        
        /* Tabs */
        .tabs {
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }
        
        .tab-buttons {
            display: flex;
            border-bottom: 1px solid #e2e8f0;
            background: #f8fafc;
        }
        
        .tab-button {
            padding: 1rem 2rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #64748b;
            font-weight: 500;
            transition: all 0.2s;
            border-bottom: 2px solid transparent;
        }
        
        .tab-button:hover { background: #f1f5f9; }
        .tab-button.active {
            color: #1e293b;
            border-bottom-color: #3b82f6;
        }
        
        .tab-content { padding: 2rem; }
        
        /* Forms */
        .form-group { margin-bottom: 1rem; }
        .form-group label {
            display: block;
            color: #475569;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 1rem;
        }
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* Buttons */
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.875rem;
        }
        
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        
        .btn-success { background: #10b981; color: white; }
        .btn-success:hover { background: #059669; }
        
        .btn-danger { background: #ef4444; color: white; }
        .btn-danger:hover { background: #dc2626; }
        
        .btn-secondary { background: #64748b; color: white; }
        .btn-secondary:hover { background: #475569; }
        
        /* Tables */
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .table th, .table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .table th { background: #f8fafc; font-weight: 600; color: #475569; }
        
        /* Packages & Plans */
        .packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .package-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            transition: transform 0.2s;
        }
        
        .package-card:hover { transform: translateY(-5px); }
        
        .package-card h3 { color: #1e293b; margin-bottom: 0.5rem; }
        .package-card .price { color: #3b82f6; font-size: 2rem; font-weight: 600; margin-bottom: 1rem; }
        .package-card .price span { font-size: 0.875rem; color: #64748b; }
        .package-card .features { list-style: none; margin-bottom: 1.5rem; text-align: left; }
        .package-card .features li { padding: 0.5rem 0; color: #1e293b; }
        .package-card .features li:before { content: '✓ '; color: #10b981; font-weight: bold; }
        
        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }
            .sidebar.active {
                transform: translateX(0);
            }
            .main-content { margin-left: 0; }
        }
        
        /* Utility */
        .hidden { display: none; }
        .text-center { text-align: center; }
        .mt-2 { margin-top: 1rem; }
        .mb-2 { margin-bottom: 1rem; }
        .p-2 { padding: 1rem; }
        
        /* Badge */
        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .badge-info { background: #dbeafe; color: #1e40af; }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="logo">
            <h1>Jasys AI</h1>
            <p>Your AI Platform</p>
        </div>
        <ul class="nav-menu">
            <li><a href="#" class="active" onclick="showTab('dashboard')">Dashboard</a></li>
            <li><a href="#" onclick="showTab('usage')">Usage & Analytics</a></li>
            <li><a href="#" onclick="showTab('api-keys')">API Keys</a></li>
            <li><a href="#" onclick="showTab('billing')">Billing</a></li>
            <li><a href="#" onclick="showTab('team')">Team</a></li>
            <li><a href="#" onclick="showTab('account')">Account</a></li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <h2 id="page-title">Dashboard</h2>
            <div class="user-profile">
                <div class="user-info">
                    <div class="name">${user.name || user.email}</div>
                    <div class="email">${user.email}</div>
                </div>
            </div>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard-tab" class="tab-content">
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Available Credits</h3>
                    <div class="value">${user.credits || 0}</div>
                    <div class="trend">
                        <span class="${(user.credits || 0) > 5000 ? 'badge-success' : 'badge-warning'} badge">
                            ${(user.credits || 0) > 5000 ? 'Good' : 'Low'} balance
                        </span>
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Total Usage</h3>
                    <div class="value">${user.total_used || 0}</div>
                    <div class="trend">
                        <span class="badge-info badge">Credits used</span>
                    </div>
                </div>
                <div class="stat-card">
                    <h3>API Keys</h3>
                    <div class="value">${user.api_keys?.length || 0}</div>
                    <div class="trend">
                        <span class="badge-info badge">Active keys</span>
                    </div>
                </div>
                <div class="stat-card">
                    <h3>Subscription</h3>
                    <div class="value">${user.subscription || 'Free'}</div>
                    <div class="trend">
                        <span class="badge-success badge">${user.subscription_status || 'Active'}</span>
                    </div>
                </div>
            </div>

            <div class="packages-grid">
                <div class="package-card">
                    <h3>Quick Actions</h3>
                    <p class="text-center mb-2">Get started with these actions</p>
                    <div class="form-group">
                        <button class="btn btn-primary w-full mb-2" onclick="createApiKey()">Create API Key</button>
                        <button class="btn btn-success w-full mb-2" onclick="showTab('billing')">Add Credits</button>
                        <button class="btn btn-secondary w-full" onclick="showTab('usage')">View Usage</button>
                    </div>
                </div>

                <div class="package-card">
                    <h3>Current Plan</h3>
                    <div class="price">${user.subscription || 'Free'}</div>
                    <p class="text-center mb-2">${user.subscription === 'free' ? 'Upgrade for more features' : 'Your current plan'}</p>
                    <button class="btn btn-primary w-full" onclick="showTab('billing')">Manage Subscription</button>
                </div>
            </div>
        </div>

        <!-- Usage Tab -->
        <div id="usage-tab" class="tab-content hidden">
            <h3>Usage Statistics</h3>
            <div class="stats-grid mt-2">
                <div class="stat-card">
                    <h3>Today's Usage</h3>
                    <div class="value">${(function() {
                        const today = new Date().toISOString().split('T')[0];
                        return user.usage_daily?.[today] || 0;
                    })()}</div>
                </div>
                <div class="stat-card">
                    <h3>Active Days</h3>
                    <div class="value">${Object.keys(user.usage_daily || {}).length}</div>
                </div>
                <div class="stat-card">
                    <h3>Unlocked Models</h3>
                    <div class="value">${user.unlocked_models?.length || 0}</div>
                </div>
            </div>

            <h3 class="mt-2">Daily Usage History</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Credits Used</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(user.usage_daily || {}).map(([date, usage]) => `
                        <tr>
                            <td>${date}</td>
                            <td>${usage}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- API Keys Tab -->
        <div id="api-keys-tab" class="tab-content hidden">
            <h3>API Keys</h3>
            <button class="btn btn-primary mb-2" onclick="createApiKey()">Create New API Key</button>
            
            ${user.api_keys && user.api_keys.length > 0 ? `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>API Key</th>
                            <th>Created</th>
                            <th>Last Used</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${user.api_keys.map(key => `
                            <tr>
                                <td>${key.name}</td>
                                <td><code>${key.key}</code></td>
                                <td>${new Date(key.created).toLocaleDateString()}</td>
                                <td>${key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</td>
                                <td>
                                    <button class="btn btn-danger" onclick="deleteApiKey('${key.key}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : `
                <p>No API keys created yet. Create your first API key to get started.</p>
            `}
        </div>

        <!-- Billing Tab -->
        <div id="billing-tab" class="tab-content hidden">
            <h3>Billing & Subscription</h3>
            
            <div class="packages-grid">
                <div class="package-card">
                    <h3>Credit Packages</h3>
                    <p class="mb-2">Add credits to your account</p>
                    ${/* Will be loaded from API */''}
                </div>

                <div class="package-card">
                    <h3>Subscription Plans</h3>
                    <p class="mb-2">Choose a plan for monthly access</p>
                    ${/* Will be loaded from API */''}
                </div>
            </div>

            <h3 class="mt-2">Billing History</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${(user.billing?.invoices || []).map(invoice => `
                        <tr>
                            <td>${new Date(invoice.date).toLocaleDateString()}</td>
                            <td>${invoice.type === 'credit_purchase' ? `Purchased ${invoice.credits} credits` : 'Subscription'}</td>
                            <td>${invoice.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td><span class="badge badge-success">${invoice.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Team Tab -->
        <div id="team-tab" class="tab-content hidden">
            <h3>Team Management</h3>
            
            ${user.team ? `
                <div class="stat-card mb-2">
                    <h3>Your Team</h3>
                    <p><strong>Team ID:</strong> ${user.team}</p>
                    <p><strong>Role:</strong> ${user.team_role}</p>
                </div>

                <h4>Team Members</h4>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${/* Will be loaded from API */''}
                    </tbody>
                </table>

                ${(user.team_role === 'owner' || user.team_role === 'admin') ? `
                    <div class="form-group mt-2">
                        <h4>Invite Member</h4>
                        <input type="email" id="invite-email" placeholder="Email address">
                        <button class="btn btn-primary mt-1" onclick="inviteTeamMember()">Invite</button>
                    </div>
                ` : ''}
            ` : `
                <div class="package-card">
                    <h3>Join or Create Team</h3>
                    <p class="mb-2">Teams allow you to share credits and manage billing centrally</p>
                    
                    <div class="form-group">
                        <input type="text" id="team-name" placeholder="Team name">
                        <button class="btn btn-primary w-full mt-1" onclick="createTeam()">Create Team</button>
                    </div>
                    
                    <div class="form-group mt-2">
                        <input type="text" id="join-team-id" placeholder="Team ID">
                        <button class="btn btn-secondary w-full mt-1" onclick="joinTeam()">Join Team</button>
                    </div>
                </div>
            `}
        </div>

        <!-- Account Tab -->
        <div id="account-tab" class="tab-content hidden">
            <h3>Account Settings</h3>
            
            <form id="account-form" onsubmit="updateAccount(event)">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" value="${user.name || ''}">
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" value="${user.email}" disabled>
                </div>
                
                <div class="form-group">
                    <label for="password">New Password</label>
                    <input type="password" id="password" placeholder="Enter new password">
                </div>
                
                <div class="form-group">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" placeholder="Confirm new password">
                </div>
                
                <button type="submit" class="btn btn-primary">Update Account</button>
            </form>

            <div class="mt-2 p-2 border-t">
                <h4>Billing Address</h4>
                <form id="billing-form" onsubmit="updateBilling(event)">
                    <div class="form-group">
                        <label for="street">Street Address</label>
                        <input type="text" id="street" value="${user.billing?.address?.street || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" value="${user.billing?.address?.city || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="country">Country</label>
                        <input type="text" id="country" value="${user.billing?.address?.country || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="postal-code">Postal Code</label>
                        <input type="text" id="postal-code" value="${user.billing?.address?.postal_code || ''}">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Update Billing Address</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadBillingData();
            loadTeamData();
        });

        // Tab navigation
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            const tabContent = document.getElementById(tabName + '-tab');
            if (tabContent) {
                tabContent.classList.remove('hidden');
            }
            
            // Update active nav link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                if (link.getAttribute('onclick').includes(tabName)) {
                    link.classList.add('active');
                }
            });
            
            // Update page title
            const pageTitle = {
                'dashboard': 'Dashboard',
                'usage': 'Usage & Analytics',
                'api-keys': 'API Keys',
                'billing': 'Billing',
                'team': 'Team',
                'account': 'Account'
            };
            document.getElementById('page-title').textContent = pageTitle[tabName] || 'Dashboard';
        }

        // API Key Management
        function createApiKey() {
            const name = prompt('Enter a name for this API key:');
            if (name) {
                fetch('/api/user/keys', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('API Key created: ' + data.key);
                        window.location.reload();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }

        function deleteApiKey(key) {
            if (confirm('Are you sure you want to delete this API key?')) {
                fetch('/api/user/keys', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        window.location.reload();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }

        // Account Management
        function updateAccount(event) {
            event.preventDefault();
            
            const updates = {};
            const name = document.getElementById('name').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (name) updates.name = name;
            if (password && password === confirmPassword) updates.password = password;
            
            fetch('/api/user/account/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    alert('Account updated successfully!');
                    window.location.reload();
                } else {
                    alert('Error: ' + data.err);
                }
            });
        }

        function updateBilling(event) {
            event.preventDefault();
            
            const address = {
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value,
                postal_code: document.getElementById('postal-code').value
            };
            
            fetch('/api/user/account/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    billing: { address }
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    alert('Billing address updated successfully!');
                } else {
                    alert('Error: ' + data.err);
                }
            });
        }

        // Billing Management
        function loadBillingData() {
            // Load credit packages and subscription plans
            const creditPackages = [
                { id: '10k', name: '10,000 Credits', price: 15000, credits: 10000 },
                { id: '50k', name: '50,000 Credits', price: 70000, credits: 50000 },
                { id: '100k', name: '100,000 Credits', price: 130000, credits: 100000 },
                { id: '500k', name: '500,000 Credits', price: 600000, credits: 500000 }
            ];
            
            const subscriptionPlans = [
                { 
                    id: 'free', 
                    name: 'Free Plan', 
                    price: 0, 
                    credits: 5000, 
                    users: 1, 
                    features: ['Basic models', '5,000 credits/month', 'Community support', 'Standard API rate limits']
                },
                { 
                    id: 'basic', 
                    name: 'Basic Plan', 
                    price: 29000, 
                    credits: 20000, 
                    users: 1, 
                    features: ['All models', '20,000 credits/month', 'Email support', 'Priority API rate limits', 'Usage analytics']
                },
                { 
                    id: 'pro', 
                    name: 'Pro Plan', 
                    price: 79000, 
                    credits: 60000, 
                    users: 5, 
                    features: ['All models', '60,000 credits/month', 'Priority email support', 'Higher API rate limits', 'Team management', 'Advanced analytics', 'Custom branding']
                },
                { 
                    id: 'enterprise', 
                    name: 'Enterprise Plan', 
                    price: 199000, 
                    credits: 200000, 
                    users: 20, 
                    features: ['All models', '200,000 credits/month', '24/7 phone support', 'Unlimited API rate limits', 'Advanced team management', 'Custom models', 'SLA guarantee', 'Dedicated account manager']
                }
            ];
            
            // Display credit packages
            const creditPackagesContainer = document.querySelector('#billing-tab .packages-grid div:first-child');
            creditPackagesContainer.innerHTML += `
                ${creditPackages.map(pkg => `
                    <div class="package-card" style="border: 1px solid #e2e8f0;">
                        <h4>${pkg.name}</h4>
                        <div class="price">${pkg.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
                        <p class="text-center mb-2">${pkg.credits.toLocaleString()} credits</p>
                        <button class="btn btn-success w-full" onclick="purchaseCredits('${pkg.id}')">Purchase</button>
                    </div>
                `).join('')}
            `;
            
            // Display subscription plans
            const subscriptionPlansContainer = document.querySelector('#billing-tab .packages-grid div:last-child');
            subscriptionPlansContainer.innerHTML += `
                ${subscriptionPlans.map(plan => `
                    <div class="package-card" style="border: 1px solid #e2e8f0;">
                        <h4>${plan.name}</h4>
                        <div class="price">${plan.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}/month</div>
                        <p class="text-center mb-2">${plan.credits.toLocaleString()} credits/month</p>
                        <ul class="features text-left">
                            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <button class="btn btn-primary w-full" onclick="subscribePlan('${plan.id}')">${plan.id === 'free' ? 'Current' : 'Subscribe'}</button>
                    </div>
                `).join('')}
            `;
        }

        function purchaseCredits(packageId) {
            if (confirm('Are you sure you want to purchase this credit package?')) {
                fetch('/api/user/credits/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ packageId })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('Credits purchased successfully! ' + data.creditsAdded + ' credits added to your account.');
                        window.location.reload();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }

        function subscribePlan(planId) {
            if (planId === 'free') {
                alert('You are already on the Free Plan');
                return;
            }
            
            if (confirm('Are you sure you want to subscribe to this plan?')) {
                fetch('/api/user/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ planId })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('Subscription successful! ' + data.creditsAdded + ' credits added to your account.');
                        window.location.reload();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }

        // Team Management
        function loadTeamData() {
            if (!${user.team ? 'true' : 'false'}) return;
            
            fetch('/api/user/team')
            .then(res => res.json())
            .then(team => {
                if (team) {
                    const membersTable = document.querySelector('#team-tab table tbody');
                    membersTable.innerHTML = \`
                        <tr>
                            <td>\${team.owner}</td>
                            <td>Owner</td>
                            <td>\${new Date(team.created).toLocaleDateString()}</td>
                            <td>-</td>
                        </tr>
                        \${team.members.map(member => `
                            <tr>
                                <td>\${member.email}</td>
                                <td>\${member.role}</td>
                                <td>\${new Date(member.joined_at).toLocaleDateString()}</td>
                                <td>
                                    \${${user.team_role === 'owner' || user.team_role === 'admin' ? `
                                        <button class="btn btn-danger" onclick="removeTeamMember('${member.email}')">Remove</button>
                                    ` : '-'}}
                                </td>
                            </tr>
                        `).join('')}
                    \`;
                }
            });
        }

        function createTeam() {
            const teamName = document.getElementById('team-name').value;
            if (!teamName) {
                alert('Please enter a team name');
                return;
            }
            
            fetch('/api/user/team/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: teamName })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    alert('Team created successfully!');
                    window.location.reload();
                } else {
                    alert('Error: ' + data.err);
                }
            });
        }

        function joinTeam() {
            const teamId = document.getElementById('join-team-id').value;
            if (!teamId) {
                alert('Please enter a team ID');
                return;
            }
            
            fetch('/api/user/team/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    alert('Joined team successfully!');
                    window.location.reload();
                } else {
                    alert('Error: ' + data.err);
                }
            });
        }

        function leaveTeam() {
            if (confirm('Are you sure you want to leave the team?')) {
                fetch('/api/user/team/leave', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('Left team successfully!');
                        window.location.reload();
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }

        function inviteTeamMember() {
            const email = document.getElementById('invite-email').value;
            if (!email) {
                alert('Please enter an email address');
                return;
            }
            
            fetch('/api/user/team/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    alert('Member invited successfully!');
                    document.getElementById('invite-email').value = '';
                    loadTeamData();
                } else {
                    alert('Error: ' + data.err);
                }
            });
        }

        function removeTeamMember(email) {
            if (confirm('Are you sure you want to remove this member?')) {
                fetch('/api/user/team/remove', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('Member removed successfully!');
                        loadTeamData();
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
