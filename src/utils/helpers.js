export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function generateToken() {
  return crypto.randomUUID().replace(/-/g, '');
}

export function formatCurrency(amount, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat('id-ID', { ...defaultOptions, ...options }).format(new Date(date));
}

export function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, '');
}

export function generateApiKey() {
  return 'sk-' + crypto.randomUUID().replace(/-/g, '');
}

export function calculateTokens(text) {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCurrentUrl(request) {
  const url = new URL(request.url);
  return url.origin;
}