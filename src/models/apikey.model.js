export class ApiKey {
  constructor(data = {}) {
    this.key = data.key || this.generateKey();
    this.name = data.name || '';
    this.created = data.created || new Date().toISOString();
    this.lastUsed = data.lastUsed || null;
    this.usageCount = data.usageCount || 0;
    this.isActive = data.isActive !== false;
    this.userEmail = data.userEmail || '';
    this.permissions = data.permissions || ['chat'];
  }

  static create(userData) {
    return new ApiKey(userData);
  }

  generateKey() {
    return 'sk-' + crypto.randomUUID().replace(/-/g, '');
  }

  updateLastUsed() {
    this.lastUsed = new Date().toISOString();
    this.usageCount += 1;
  }

  deactivate() {
    this.isActive = false;
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      created: this.created,
      lastUsed: this.lastUsed,
      usageCount: this.usageCount,
      isActive: this.isActive,
      userEmail: this.userEmail,
      permissions: this.permissions
    };
  }
}