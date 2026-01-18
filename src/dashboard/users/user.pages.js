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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; }
        .header { background: white; border-bottom: 1px solid #e2e8f0; padding: 1rem 2rem; }
        .header h1 { color: #1e293b; font-size: 1.5rem; }
        .user-info { color: #64748b; font-size: 0.875rem; margin-top: 0.25rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; }
        .stat-card h3 { color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .stat-card .value { color: #1e293b; font-size: 2rem; font-weight: 600; }
        .actions { background: white; border-radius: 8px; border: 1px solid #e2e8f0; padding: 1.5rem; }
        .actions h2 { color: #1e293b; margin-bottom: 1rem; }
        .btn { background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; margin-right: 0.5rem; }
        .btn:hover { background: #2563eb; }
        .btn-secondary { background: #64748b; }
        .btn-secondary:hover { background: #475569; }
    </style>
</head>
<body>
    <div class="header">
        <h1>User Dashboard</h1>
        <div class="user-info">${user.name || user.email}</div>
    </div>
    
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <h3>Available Credits</h3>
                <div class="value">${user.credits || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Total Usage</h3>
                <div class="value">${user.total_used || 0}</div>
            </div>
            <div class="stat-card">
                <h3>API Keys</h3>
                <div class="value">${user.api_keys?.length || 0}</div>
            </div>
        </div>
        
        <div class="actions">
            <h2>Quick Actions</h2>
            <button class="btn" onclick="createApiKey()">Create API Key</button>
            <button class="btn btn-secondary" onclick="viewUsage()">View Usage</button>
            <button class="btn btn-secondary" onclick="manageAccount()">Manage Account</button>
        </div>
    </div>
    
    <script>
        function createApiKey() {
            const name = prompt('Enter a name for this API key:');
            if (name) {
                fetch('/api/user/create-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        alert('API Key created: ' + data.key);
                    } else {
                        alert('Error: ' + data.err);
                    }
                });
            }
        }
        
        function viewUsage() {
            window.location.href = '/app/usage';
        }
        
        function manageAccount() {
            window.location.href = '/app/account';
        }
    </script>
</body>
</html>
  `;
}