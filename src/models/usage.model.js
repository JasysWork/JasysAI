export class UsageLog {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.email = data.email || '';
    this.model = data.model || '';
    this.promptTokens = data.promptTokens || 0;
    this.completionTokens = data.completionTokens || 0;
    this.totalTokens = data.totalTokens || 0;
    this.cost = data.cost || 0;
    this.time = data.time || new Date().toISOString();
    this.requestId = data.requestId || this.generateRequestId();
    this.duration = data.duration || 0;
    this.status = data.status || 'success';
    this.errorMessage = data.errorMessage || null;
  }

  static create(logData) {
    return new UsageLog(logData);
  }

  generateId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateRequestId() {
    return 'req_' + crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  }

  calculateTotalTokens() {
    this.totalTokens = this.promptTokens + this.completionTokens;
    return this.totalTokens;
  }

  setDuration(startTime) {
    this.duration = Date.now() - startTime;
  }

  markAsFailed(errorMessage) {
    this.status = 'failed';
    this.errorMessage = errorMessage;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      model: this.model,
      promptTokens: this.promptTokens,
      completionTokens: this.completionTokens,
      totalTokens: this.totalTokens,
      cost: this.cost,
      time: this.time,
      requestId: this.requestId,
      duration: this.duration,
      status: this.status,
      errorMessage: this.errorMessage
    };
  }
}