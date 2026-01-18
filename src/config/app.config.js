export default {
  site_name: "Jasys AI",
  site_url: "https://ai-proxy.jasyscom-corp.workers.dev",
  admin_user: "jasyscorp",
  admin_pass: "Jasyscorp-admin123000",
  default_credits: 50000,
  profit_margin: 1.2,
  idr_rate: 16000,
  guest_limit: 5,
  // Default model settings
  default_models: {
    guest: ['openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku', 'meta-llama/llama-3.1-8b-instruct'],
    user: ['openai/gpt-4', 'anthropic/claude-3-opus', 'openai/gpt-4-turbo', 'anthropic/claude-3-sonnet']
  },
  // Packages for unlocking models
  packages: [
    { id: 'basic', name: 'Basic Package', price: 25000, unlocks: ['openai/gpt-4'] },
    { id: 'premium', name: 'Premium Package', price: 50000, unlocks: ['openai/gpt-4', 'anthropic/claude-3-opus'] },
    { id: 'ultimate', name: 'Ultimate Package', price: 100000, unlocks: ['openai/gpt-4', 'anthropic/claude-3-opus', 'openai/gpt-4-turbo'] }
  ]
};