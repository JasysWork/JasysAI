import { DB } from '../../db/index.js';
import { CONFIG } from '../../config/index.js';

export class UserController {
  static async createApiKey(env, email, name) {
    const user = await DB.get(env, `u:${email}`);
    if (!user) return { err: "User not found" };
    
    const apiKey = 'sk-' + crypto.randomUUID().replace(/-/g, '');
    const keyData = {
      key: apiKey,
      name,
      created: new Date().toISOString(),
      lastUsed: null
    };
    
    user.api_keys = user.api_keys || [];
    user.api_keys.push(keyData);
    
    await DB.set(env, `u:${email}`, user);
    return { ok: true, key: apiKey };
  }

  static async deleteApiKey(env, email, key) {
    const user = await DB.get(env, `u:${email}`);
    if (!user) return { err: "User not found" };
    
    user.api_keys = user.api_keys.filter(k => k.key !== key);
    await DB.set(env, `u:${email}`, user);
    return { ok: true };
  }

  static async purchasePackage(env, email, packageId) {
    const user = await DB.get(env, `u:${email}`);
    if (!user) return { err: "User not found" };
    
    const pkg = CONFIG.packages.find(p => p.id === packageId);
    if (!pkg) return { err: "Package not found" };
    
    if (user.credits < pkg.price) {
      return { err: "Insufficient credits" };
    }
    
    user.credits -= pkg.price;
    user.unlocked_models = user.unlocked_models || [];
    pkg.unlocks.forEach(model => {
      if (!user.unlocked_models.includes(model)) {
        user.unlocked_models.push(model);
      }
    });
    
    await DB.set(env, `u:${email}`, user);
    return { ok: true };
  }

  static async updateAccount(env, email, updates) {
    const user = await DB.get(env, `u:${email}`);
    if (!user) return { err: "User not found" };
    
    if (updates.name) user.name = updates.name;
    if (updates.password) user.pass = updates.password;
    
    await DB.set(env, `u:${email}`, user);
    return { ok: true };
  }

  static async getChatHistory(env, email) {
    const history = await DB.get(env, `chat:${email}`) || [];
    return history.map(h => ({
      id: h.id,
      title: h.title || 'Untitled Chat',
      date: h.created,
      messageCount: h.messages?.length || 0
    }));
  }

  static async getUsageStats(env, email) {
    const user = await DB.get(env, `u:${email}`);
    if (!user) return null;
    
    const today = new Date().toISOString().split('T')[0];
    const todayUsage = user.usage_daily?.[today] || 0;
    
    return {
      totalCredits: user.credits,
      totalUsed: user.total_used || 0,
      todayUsage,
      activeDays: Object.keys(user.usage_daily || {}).length,
      apiKeysCount: user.api_keys?.length || 0,
      unlockedModelsCount: user.unlocked_models?.length || 0
    };
  }
}