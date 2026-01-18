import { ContentModel } from '../../models/index.js';

export class ContentController {
  static async getAllContent(request, env) {
    try {
      const result = await ContentModel.getAll(env);
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, err: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  static async getContent(request, env) {
    try {
      const url = new URL(request.url);
      const key = url.searchParams.get('key');
      
      if (!key) {
        return new Response(JSON.stringify({ ok: false, err: 'Key is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const content = await ContentModel.get(env, key);
      return new Response(JSON.stringify({ ok: true, data: content }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, err: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  static async updateContent(request, env) {
    try {
      const { key, title, content } = await request.json();
      
      if (!key) {
        return new Response(JSON.stringify({ ok: false, err: 'Key is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await ContentModel.set(env, key, { title, content });
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, err: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  static async deleteContent(request, env) {
    try {
      const url = new URL(request.url);
      const key = url.searchParams.get('key');
      
      if (!key) {
        return new Response(JSON.stringify({ ok: false, err: 'Key is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await ContentModel.delete(env, key);
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, err: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}