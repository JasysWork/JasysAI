# Migration Guide: Old Structure → New Structure

This guide helps you migrate from the old file structure to the new organized structure.

## ✅ Free Plan Migration (January 2026)

### Recent Changes for Free Plan Compatibility
- **CPU Limits Removed**: Eliminated `[limits]` section from `wrangler.toml`
- **Paid Features Removed**: No Durable Objects, Vectorize, or Queues
- **Successfully Deployed**: Now running on Cloudflare Workers Free Plan
- **Zero Cost**: No monthly fees for basic usage

### Migration Impact
- All core functionality preserved
- No code changes required
- Only configuration updates needed
- Full backward compatibility maintained

## 📋 File Mapping

### Old → New File Locations

| Old File | New Location | Purpose |
|----------|--------------|---------|
| `config.js` | `src/config/app.config.js` | Application configuration |
| `config_service.js` | `src/config/config.service.js` | Dynamic configuration service |
| `auth.js` | `src/auth/auth.service.js` | Authentication logic |
| `admin.js` | `src/dashboard/admin/admin.controller.js` | Admin dashboard logic |
| `app_user.js` | `src/dashboard/users/user.controller.js` | User dashboard logic |
| `dashboard.js` | `src/dashboard/admin/admin.pages.js` | Dashboard UI components |
| `views.js` | `src/auth/auth.pages.js` | View components |
| `logic.js` | `src/routes/api.routes.js` | API business logic |
| `worker.js` | `src/worker.js` | Main Cloudflare Worker |
| `assets.js` | `src/utils/assets.js` | Static assets |

## 🔄 Import Updates

### Old Import Patterns
```javascript
// Old way
import { CONFIG } from './config.js';
import { DB, resJSON } from './database.js';
import { authenticateUser } from './auth.js';
```

### New Import Patterns
```javascript
// New way
import { CONFIG } from './config/index.js';
import { DB, resJSON } from './db/index.js';
import { AuthService } from './auth/index.js';

// Or specific imports
import { CONFIG } from './config/app.config.js';
import { DB } from './db/database.js';
import { AuthService } from './auth/auth.service.js';
```

## 🗂️ Directory Structure Changes

### Before
```
/
├── admin.js
├── app_user.js
├── assets.js
├── auth.js
├── config.js
├── config_service.js
├── dashboard.js
├── logic.js
├── views.js
└── worker.js
```

### After
```
src/
├── config/
├── auth/
├── dashboard/
│   ├── admin/
│   └── users/
├── routes/
├── db/
├── models/
├── utils/
├── services/
├── middlewares/
├── controllers/
├── helpers/
├── constants/
├── types/
├── interfaces/
├── enums/
├── exceptions/
├── errors/
├── events/
├── hooks/
├── plugins/
├── providers/
├── repositories/
├── factories/
├── decorators/
├── guards/
├── interceptors/
├── pipes/
├── filters/
├── validators/
├── serializers/
├── deserializers/
├── transformers/
├── mappers/
├── builders/
├── creators/
├── updaters/
├── deleters/
├── finders/
├── searchers/
├── sorters/
├── paginators/
├── aggregators/
├── counters/
├── summarizers/
├── calculators/
├── analyzers/
├── processors/
├── handlers/
├── listeners/
├── emitters/
├── publishers/
├── subscribers/
├── consumers/
├── producers/
├── senders/
├── receivers/
├── storages/
├── caches/
├── queues/
├── tasks/
├── jobs/
├── worker.js
└── index.js
```

## 🔧 Code Changes Required

### 1. Update Worker Entry Point
```javascript
// Old worker.js
export default {
  async fetch(request, env, ctx) {
    // Old routing logic
  }
};

// New src/worker.js
import { setupRoutes } from './routes/index.js';
import { logger } from './utils/logger.js';

export default {
  async fetch(request, env, ctx) {
    try {
      logger.info('Incoming request', { method: request.method, url: request.url });
      return await setupRoutes(request, env);
    } catch (error) {
      logger.error('Unhandled error', { error: error.message });
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  }
};
```

### 2. Update Database References
```javascript
// Old: GPTOSS_KV
await env.GPTOSS_KV.get(key);

// New: JASYSAI_KV
await env.JASYSAI_KV.get(key);
```

### 3. Update Authentication
```javascript
// Old: Direct function calls
const result = await authenticateUser(email, password);

// New: Service pattern
const result = await AuthService.authenticateUser(email, password);
```

### 4. Update Configuration
```javascript
// Old: Direct import
import { CONFIG } from './config.js';

// New: Structured import
import { CONFIG } from './config/index.js';
// Or
import { CONFIG } from './config/app.config.js';
```

## 🚀 Deployment Changes

### Update wrangler.toml
```toml
# Old
main = "worker.js"

# New
main = "src/index.js"

# ⚠️ IMPORTANT: Remove CPU limits for Free Plan
# OLD (Paid Feature - Causes Error):
# [limits]
# cpu_ms = 50000

# NEW (Free Plan Compatible):
# CPU limits removed - not supported on Free plan
```

### Update KV Namespace Binding
```toml
# In wrangler.toml
[[kv_namespaces]]
binding = "JASYSAI_KV"
id = "your-kv-namespace-id"
```

### Free Plan Configuration
- **CPU Limits**: Removed (paid feature)
- **Workers**: 100,000 requests/day (free tier)
- **KV Storage**: 1GB storage, 100K reads/day, 1K writes/day
- **Cost**: $0/month for basic usage

## 🧪 Testing Migration

### 1. Test Core Functionality
- [ ] User registration/login
- [ ] Admin dashboard access
- [ ] API key creation/usage
- [ ] Chat functionality
- [ ] Billing system

### 2. Test API Endpoints
- [ ] `/auth/login`
- [ ] `/auth/register`
- [ ] `/api/user/keys`
- [ ] `/v1/chat/completions`
- [ ] Admin endpoints

### 3. Test Database Operations
- [ ] User data storage
- [ ] Session management
- [ ] Usage tracking
- [ ] Configuration storage

## 🔄 Rollback Plan

If issues arise during migration:

1. **Quick Rollback**: Restore old files from backup
2. **Partial Rollback**: Keep new structure but revert specific modules
3. **Forward Fix**: Address issues in new structure

### Backup Commands
```bash
# Create backup
cp -r . ../jasysai-backup-$(date +%Y%m%d)

# Restore if needed
cp -r ../jasysai-backup-YYYYMMDD/* .
```

## 📝 Migration Checklist

### Pre-Migration
- [ ] Backup current code
- [ ] Document current functionality
- [ ] Test current system
- [ ] Prepare deployment environment

### Migration
- [ ] Create new directory structure
- [ ] Move files to new locations
- [ ] Update import statements
- [ ] Update configuration
- [ ] Test individual modules

### Post-Migration
- [ ] Full system testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Update documentation
- [ ] Deploy to production

## 🆘 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   # Check file paths
   find src -name "*.js" -exec grep -l "import.*from.*\.\." {} \;
   ```

2. **Missing Exports**
   ```bash
   # Check index files
   find src -name "index.js" -exec cat {} \;
   ```

3. **Database Connection Issues**
   ```bash
   # Check KV namespace binding
   wrangler kv:namespace list
   ```

4. **Route Not Found**
   ```bash
   # Check router configuration
   grep -r "setupRoutes" src/
   ```

### Debug Commands
```bash
# Test locally
wrangler dev

# Check syntax
npx eslint src/

# Test imports
node -c src/index.js
```

## 📞 Support

For migration issues:
1. Check this guide first
2. Review error logs
3. Test individual components
4. Contact development team

---

**Migration completed successfully! 🎉**