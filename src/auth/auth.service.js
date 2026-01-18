import { DB } from '../db/index.js';
import { CONFIG } from '../config/index.js';

export class AuthService {
  static async authenticateUser(email, password) {
    const user = await DB.get(null, `u:${email}`);
    if (user && user.pass === password) {
      const token = 'usr_' + crypto.randomUUID().replace(/-/g,'');
      await DB.set(null, `sess:${token}`, { role: 'user', email }, 86400 * 7);
      return { ok: true, token, role: 'user' };
    }
    return { err: "Email atau Password Salah" };
  }

  static async authenticateAdmin(username, password) {
    if (username === CONFIG.admin_user && password === CONFIG.admin_pass) {
      const token = 'adm_' + crypto.randomUUID().replace(/-/g,'');
      await DB.set(null, `sess:${token}`, { role: 'admin' }, 86400 * 7);
      return { ok: true, token, role: 'admin' };
    }
    return { err: "Invalid credentials" };
  }

  static async registerUser(email, password, name) {
    if (!email || !password || !name) return { err: "All fields required" };
    
    const existing = await DB.get(null, `u:${email}`);
    if (existing) return { err: "Email already registered" };
    
    const user = {
      email,
      name,
      pass: password,
      credits: CONFIG.default_credits,
      api_keys: [],
      created: new Date().toISOString(),
      usage_daily: {},
      total_used: 0,
      unlocked_models: []
    };
    
    await DB.set(null, `u:${email}`, user);
    const token = 'usr_' + crypto.randomUUID().replace(/-/g,'');
    await DB.set(null, `sess:${token}`, { role: 'user', email }, 86400 * 7);
    return { ok: true, token, role: 'user' };
  }

  static async validateSession(token) {
    return await DB.get(null, `sess:${token}`);
  }

  static async getUserByEmail(email) {
    return await DB.get(null, `u:${email}`);
  }
}