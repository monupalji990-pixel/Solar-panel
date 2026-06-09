// Test if @azure/identity loads without syntax errors
try {
  const { ClientSecretCredential } = require('@azure/identity');
  console.log('✓ @azure/identity loaded successfully');
  console.log('✓ ClientSecretCredential available');
  process.exit(0);
} catch (err) {
  console.error('✗ Error loading @azure/identity:', err.message);
  console.error(err);
  process.exit(1);
}
