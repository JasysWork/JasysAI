export class Team {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'My Team';
    this.owner = data.owner || ''; // Email of team owner
    this.members = data.members || []; // Array of { email, role, joined_at }
    this.created = data.created || new Date().toISOString();
    this.credits = data.credits || 0;
    this.usage_daily = data.usage_daily || {};
    this.total_used = data.total_used || 0;
    this.subscription = data.subscription || 'free';
    this.subscription_status = data.subscription_status || 'active';
    this.subscription_end = data.subscription_end || null;
    this.billing = data.billing || {
      payment_method: null,
      invoices: [],
      address: null
    };
  }

  static create(teamData) {
    return new Team(teamData);
  }

  static fromDB(data) {
    return new Team(data);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner,
      members: this.members,
      created: this.created,
      credits: this.credits,
      usage_daily: this.usage_daily,
      total_used: this.total_used,
      subscription: this.subscription,
      subscription_status: this.subscription_status,
      subscription_end: this.subscription_end,
      billing: this.billing
    };
  }

  addMember(email, role = 'member') {
    if (!this.members.find(m => m.email === email)) {
      this.members.push({
        email,
        role,
        joined_at: new Date().toISOString()
      });
    }
  }

  removeMember(email) {
    this.members = this.members.filter(m => m.email !== email);
  }

  updateMemberRole(email, role) {
    const member = this.members.find(m => m.email === email);
    if (member) {
      member.role = role;
    }
  }

  deductCredits(amount) {
    if (this.credits >= amount) {
      this.credits -= amount;
      this.total_used += amount;
      
      const today = new Date().toISOString().split('T')[0];
      this.usage_daily[today] = (this.usage_daily[today] || 0) + amount;
      
      return true;
    }
    return false;
  }

  addCredits(amount) {
    this.credits += amount;
  }

  getUsageStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayUsage = this.usage_daily[today] || 0;
    
    return {
      totalCredits: this.credits,
      totalUsed: this.total_used,
      todayUsage,
      activeDays: Object.keys(this.usage_daily).length,
      membersCount: this.members.length + 1, // Include owner
      subscription: this.subscription
    };
  }
}
