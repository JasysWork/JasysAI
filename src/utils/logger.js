export class Logger {
  static log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context
    };
    
    console.log(JSON.stringify(logEntry));
  }

  static info(message, context = {}) {
    this.log('INFO', message, context);
  }

  static warn(message, context = {}) {
    this.log('WARN', message, context);
  }

  static error(message, context = {}) {
    this.log('ERROR', message, context);
  }

  static debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }
}

export const logger = Logger;