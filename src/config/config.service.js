// @ts-nocheck
// Dynamic Configuration Service using KV storage
export class ConfigService {
  static async getGuestLimit(env) {
    try {
      // Use DB instead of direct KV access for consistency
      const settings = await env.DB.get('sys_settings');
      if (settings) {
        return settings.guest_limit || 5; // Default fallback
      }
    } catch (error) {
      console.error('Error fetching guest limit:', error);
    }
    return 5; // Default fallback
  }

  static async setGuestLimit(env, limit) {
    try {
      // Use DB instead of direct KV access for consistency
      const settings = await env.DB.get('sys_settings') || {};
      settings.guest_limit = String(parseInt(limit));
      await env.DB.set('sys_settings', settings);
      return true;
    } catch (error) {
      console.error('Error setting guest limit:', error);
      return false;
    }
  }

  static async getAllSettings(env) {
    try {
      // Use DB instead of direct KV access for consistency
      const settings = await env.DB.get('sys_settings');
      return settings || {
        guest_limit: 5,
        openrouter_key: '',
        guest_models: ['openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku', 'meta-llama/llama-3.1-8b-instruct'],
        user_models: ['openai/gpt-4', 'anthropic/claude-3-opus', 'openai/gpt-4-turbo', 'anthropic/claude-3-sonnet']
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        guest_limit: 5,
        openrouter_key: '',
        guest_models: ['openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku', 'meta-llama/llama-3.1-8b-instruct'],
        user_models: ['openai/gpt-4', 'anthropic/claude-3-opus', 'openai/gpt-4-turbo', 'anthropic/claude-3-sonnet']
      };
    }
  }

  static async updateSettings(env, settings) {
    try {
      const current = await this.getAllSettings(env);
      const updated = { ...current, ...settings };
      await env.CONFIG_KV.put('system_settings', JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }

  static async isAdminBypassEnabled(env) {
    try {
      const settings = await env.CONFIG_KV.get('system_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.admin_bypass !== false; // Default to true
      }
    } catch (error) {
      console.error('Error checking admin bypass:', error);
    }
    return true; // Default fallback
  }

  static async setAdminBypass(env, enabled) {
    try {
      const settings = await env.CONFIG_KV.get('system_settings');
      const parsed = settings ? JSON.parse(settings) : {};
      parsed.admin_bypass = enabled;
      await env.CONFIG_KV.put('system_settings', JSON.stringify(parsed));
      return true;
    } catch (error) {
      console.error('Error setting admin bypass:', error);
      return false;
    }
  }
}