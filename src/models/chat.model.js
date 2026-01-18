export class ChatSession {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || 'New Chat';
    this.created = data.created || new Date().toISOString();
    this.updated = data.updated || new Date().toISOString();
    this.messages = data.messages || [];
    this.userEmail = data.userEmail || '';
    this.model = data.model || 'openai/gpt-3.5-turbo';
    this.totalTokens = data.totalTokens || 0;
    this.totalCost = data.totalCost || 0;
  }

  static create(userData) {
    return new ChatSession(userData);
  }

  static fromDB(data) {
    return new ChatSession(data);
  }

  generateId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addMessage(role, content, tokens = 0) {
    const message = {
      role,
      content,
      timestamp: new Date().toISOString(),
      tokens
    };
    
    this.messages.push(message);
    this.totalTokens += tokens;
    this.updated = new Date().toISOString();
    
    // Auto-generate title from first user message
    if (this.messages.length === 1 && role === 'user') {
      this.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
    }
    
    return message;
  }

  getLastMessage() {
    return this.messages[this.messages.length - 1] || null;
  }

  getMessageCount() {
    return this.messages.length;
  }

  updateCost(cost) {
    this.totalCost += cost;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      created: this.created,
      updated: this.updated,
      messages: this.messages,
      userEmail: this.userEmail,
      model: this.model,
      totalTokens: this.totalTokens,
      totalCost: this.totalCost
    };
  }
}