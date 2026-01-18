import { setupRoutes } from './routes/index.js';
import { logger } from './utils/logger.js';

export default {
  async fetch(request, env, ctx) {
    try {
      logger.info('Incoming request', { 
        method: request.method, 
        url: request.url,
        userAgent: request.headers.get('user-agent')
      });

      const response = await setupRoutes(request, env);
      
      logger.info('Request completed', { 
        status: response.status,
        url: request.url
      });

      return response;
    } catch (error) {
      logger.error('Unhandled error', { 
        error: error.message,
        stack: error.stack,
        url: request.url 
      });

      return new Response(JSON.stringify({ 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async scheduled(event, env, ctx) {
    try {
      logger.info('Scheduled task started', {
        scheduledTime: event.scheduledTime
      });

      // Only run cleanup if KV namespace is available
      if (env.JASYSAI_KV) {
        // Clean up old sessions
        await cleanupOldSessions(env);
        
        // Clean up old logs
        await cleanupOldLogs(env);
      }

      logger.info('Scheduled task completed');
    } catch (error) {
      logger.error('Scheduled task failed', {
        error: error.message,
        stack: error.stack
      });
    }
  }
};

async function cleanupOldSessions(env) {
  const sessions = await env.JASYSAI_KV.list({ prefix: 'sess:' });
  const now = Date.now();
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);

  for (const session of sessions.keys) {
    const sessionData = await env.JASYSAI_KV.get(session.name);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      const sessionTime = new Date(parsed.created || parsed.time).getTime();
      
      if (sessionTime < weekAgo) {
        await env.JASYSAI_KV.delete(session.name);
        logger.info('Cleaned up old session', { key: session.name });
      }
    }
  }
}

async function cleanupOldLogs(env) {
  const logs = await env.JASYSAI_KV.list({ prefix: 'log:' });
  const now = Date.now();
  const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

  for (const log of logs.keys) {
    const logTime = parseInt(log.name.split(':')[1]);
    
    if (logTime < monthAgo) {
      await env.JASYSAI_KV.delete(log.name);
      logger.info('Cleaned up old log', { key: log.name });
    }
  }
}