export function AdminApp(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - JasyAI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; }
        .header { background: white; border-bottom: 1px solid #e2e8f0; padding: 1rem 2rem; }
        .header h1 { color: #1e293b; font-size: 1.5rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; }
        .stat-card h3 { color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .stat-card .value { color: #1e293b; font-size: 2rem; font-weight: 600; }
        .logs { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
        .logs h2 { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
        .log-item { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
        .log-item:last-child { border-bottom: none; }
        .log-time { color: #64748b; font-size: 0.875rem; }
        .log-email { color: #1e293b; font-weight: 500; }
        .log-action { color: #059669; }
    </style>
</head>
<body>
    <div class="header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1>Admin Dashboard</h1>
            <nav style="display: flex; gap: 1rem;">
                <a href="/admin/dashboard" style="color: #1e293b; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; background: #f1f5f9;">Dashboard</a>
                <a href="/admin/content" style="color: #64748b; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px;">Content</a>
                <a href="/admin" style="color: #dc2626; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px;">Logout</a>
            </nav>
        </div>
    </div>
    
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <h3>Total Users</h3>
                <div class="value">${data.userCount || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Recent Activity</h3>
                <div class="value">${data.logs?.length || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Content Pages</h3>
                <div class="value">6</div>
            </div>
            <div class="stat-card">
                <h3>Quick Actions</h3>
                <div style="margin-top: 0.5rem;">
                    <a href="/admin/content" style="display: inline-block; background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; margin-right: 0.5rem;">Manage Content</a>
                </div>
            </div>
        </div>
        
        <div class="logs">
            <h2>Recent Activity</h2>
            ${data.logs?.map(log => `
                <div class="log-item">
                    <div class="log-time">${new Date(log.timestamp).toLocaleString()}</div>
                    <div class="log-email">${log.email}</div>
                    <div class="log-action">${log.action}</div>
                </div>
            `).join('') || '<div class="log-item">No recent activity</div>'}
        </div>
    </div>
</body>
</html>
  `;
}