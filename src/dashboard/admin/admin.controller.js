import { DB } from '../../db/index.js';
import { ConfigService } from '../../config/config.service.js';

export class AdminController {
  static async getDashboardData(env) {
    const users = await DB.list(env, 'u:');
    const logs = await DB.list(env, 'log:');
    const settings = await ConfigService.getAllSettings(env);
    
    const recentLogs = [];
    for (const log of logs.keys.slice(-50)) {
      const data = await DB.get(env, log.name);
      if (data) recentLogs.push(data);
    }
    
    return {
      userCount: users.keys.length,
      logs: recentLogs.reverse(),
      settings
    };
  }

  static async updateSettings(env, settings) {
    return await ConfigService.updateSettings(env, settings);
  }

  static async getUsers(env) {
    const users = await DB.list(env, 'u:');
    const userList = [];
    
    for (const userKey of users.keys) {
      const user = await DB.get(env, userKey.name);
      if (user) {
        userList.push({
          email: user.email,
          name: user.name,
          credits: user.credits,
          created: user.created,
          total_used: user.total_used || 0
        });
      }
    }
    
    return userList;
  }

  static async getUserLogs(env, email) {
    const logs = await DB.list(env, `log:`);
    const userLogs = [];
    
    for (const logKey of logs.keys) {
      const data = await DB.get(env, logKey.name);
      if (data && data.email === email) {
        userLogs.push(data);
      }
    }
    
    return userLogs.reverse();
  }
}