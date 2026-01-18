// Simple test to verify the configuration works
import { readFileSync } from 'fs';

try {
  const wranglerConfig = readFileSync('./wrangler.toml', 'utf-8');
  
  console.log('✅ wrangler.toml file exists and readable');
  
  // Check that no CPU limits are configured
  if (wranglerConfig.includes('[limits]') && wranglerConfig.includes('cpu_ms')) {
    console.log('❌ CPU limits still configured - this will fail on free plan');
    process.exit(1);
  } else {
    console.log('✅ No CPU limits configured - compatible with free plan');
  }
  
  // Check for paid features
  const paidFeatures = [];
  if (wranglerConfig.includes('[[durable_objects]]')) paidFeatures.push('Durable Objects');
  if (wranglerConfig.includes('[[vectorize]]')) paidFeatures.push('Vectorize');
  if (wranglerConfig.includes('[[queues]]')) paidFeatures.push('Queues');
  if (wranglerConfig.includes('[[rate_limits]]')) paidFeatures.push('Rate Limits');
  
  if (paidFeatures.length > 0) {
    console.log('❌ Paid features detected:', paidFeatures.join(', '));
    process.exit(1);
  } else {
    console.log('✅ No paid features detected - compatible with free plan');
  }
  
  // Check for basic required configuration
  if (wranglerConfig.includes('name = "jasysai"')) {
    console.log('✅ Worker name configured');
  } else {
    console.log('❌ Worker name not found');
    process.exit(1);
  }
  
  if (wranglerConfig.includes('main = "src/index.js"')) {
    console.log('✅ Main entry point configured');
  } else {
    console.log('❌ Main entry point not found');
    process.exit(1);
  }
  
  console.log('\n🎉 Configuration is ready for Cloudflare Workers Free Plan!');
  console.log('📋 Summary:');
  console.log('   - CPU limits: Removed (Free plan compatible)');
  console.log('   - Paid features: None detected');
  console.log('   - KV Storage: Available on Free plan');
  console.log('   - Build step: No-op (as required for Workers)');
  
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}