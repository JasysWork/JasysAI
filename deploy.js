#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 JasyAI Auto Deployment');
console.log('=========================');

// Check if wrangler is logged in
try {
  execSync('wrangler whoami', { stdio: 'pipe' });
} catch (error) {
  console.log('🔐 Please login to Cloudflare first:');
  execSync('wrangler auth login', { stdio: 'inherit' });
}

// Create or get KV namespace for production
console.log('📦 Setting up KV namespace...');
try {
  let kvId;

  // Try to create new KV namespace
  try {
    const output = execSync('wrangler kv:namespace create "JASYSAI_KV" --preview false', { encoding: 'utf8' });
    const kvIdMatch = output.match(/"([^"]+)"/);
    kvId = kvIdMatch ? kvIdMatch[1] : null;

    if (kvId) {
      console.log(`✅ KV Namespace created with ID: ${kvId}`);
    }
  } catch (createError) {
    console.log('⚠️  KV namespace might already exist, trying to list...');
  }

  // If creation failed or no ID, try to list existing namespaces
  if (!kvId) {
    try {
      const listOutput = execSync('wrangler kv:namespace list', { encoding: 'utf8' });
      // Parse the JSON output to find our namespace
      const namespaces = JSON.parse(listOutput);
      const ourNamespace = namespaces.find(ns => ns.title === 'JASYSAI_KV');

      if (ourNamespace) {
        kvId = ourNamespace.id;
        console.log(`✅ Found existing KV Namespace with ID: ${kvId}`);
      } else {
        throw new Error('KV namespace not found');
      }
    } catch (listError) {
      console.error('❌ Failed to find or create KV namespace:', listError.message);
      throw new Error('Could not setup KV namespace');
    }
  }

  // Update wrangler.toml with the KV ID
  let wranglerToml = fs.readFileSync('wrangler.toml', 'utf8');
  wranglerToml = wranglerToml.replace(/id = "[^"]*"/, `id = "${kvId}"`);
  fs.writeFileSync('wrangler.toml', wranglerToml);

  console.log('📝 Updated wrangler.toml with KV binding');

  // Deploy the worker
  console.log('🚀 Deploying worker...');
  execSync('wrangler deploy', { stdio: 'inherit' });

  console.log('🎉 Deployment successful!');
  console.log('🌐 Your app is now live at: https://ai.jasyscom.workers.dev');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}