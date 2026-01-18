#!/bin/bash

# JasyAI Quick Setup Script
# This script helps you set up the project for one-click deployment

echo "🚀 JasyAI Quick Setup Script"
echo "============================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
else
    echo "✅ Wrangler CLI already installed"
fi

# Login to Cloudflare
echo "🔐 Logging into Cloudflare..."
wrangler auth login

# Create KV namespaces
echo "📦 Creating KV namespaces..."
PROD_KV=$(wrangler kv:namespace create "JASYSAI_KV" | grep "id" | cut -d'"' -f4)
PREVIEW_KV=$(wrangler kv:namespace create "JASYSAI_KV" --preview | grep "id" | cut -d'"' -f4)

echo "✅ Production KV ID: $PROD_KV"
echo "✅ Preview KV ID: $PREVIEW_KV"

# Update wrangler.toml with KV IDs
echo "📝 Updating wrangler.toml..."
sed -i "s/your-production-kv-id/$PROD_KV/g" wrangler.toml
sed -i "s/your-preview-kv-id/$PREVIEW_KV/g" wrangler.toml

# Set secrets
echo "🔑 Setting up secrets..."
echo "Please enter your OpenRouter API Key:"
wrangler secret put OPENROUTER_KEY

echo "Please enter your admin username:"
wrangler secret put ADMIN_USER

echo "Please enter your admin password:"
wrangler secret put ADMIN_PASS

echo "Generating JWT secret..."
wrangler secret put JWT_SECRET

# Get Cloudflare account info
ACCOUNT_ID=$(wrangler whoami | grep "Account ID" | cut -d':' -f2 | tr -d ' ')
echo "📋 Your Cloudflare Account ID: $ACCOUNT_ID"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your domain in wrangler.toml"
echo "2. Push your code to GitHub"
echo "3. Add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID to GitHub Secrets"
echo "4. Push to main branch to trigger deployment"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"