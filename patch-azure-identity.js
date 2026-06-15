#!/usr/bin/env node

/**
 * Patch @azure/identity for Node 12 compatibility
 * Replaces optional chaining (?.) and nullish coalescing (??) with Node 12-compatible syntax
 */

const fs = require('fs');
const path = require('path');

// Map of exact find-and-replace pairs to fix syntax
const replacementMap = {
  'node_modules/@azure/identity/dist/commonjs/msal/nodeFlows/msalPlugins.js': [
    ['options.brokerOptions?.enabled ?? false', '(options.brokerOptions != null ? options.brokerOptions.enabled : false)'],
    ['options.brokerOptions?.legacyEnableMsaPassthrough ?? false', '(options.brokerOptions != null ? options.brokerOptions.legacyEnableMsaPassthrough : false)'],
    ['options.tokenCachePersistenceOptions?.enabled', '(options.tokenCachePersistenceOptions != null ? options.tokenCachePersistenceOptions.enabled : false)'],
    ['options.tokenCachePersistenceOptions.name', 'options.tokenCachePersistenceOptions.name'],
    ['options.brokerOptions?.enabled', '(options.brokerOptions != null ? options.brokerOptions.enabled : undefined)'],
  ],
};

console.log('Patching @azure/identity for Node 12 compatibility...\n');

Object.entries(replacementMap).forEach(([filePath, replacements]) => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⊘ Skipped (not found): ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    
    replacements.forEach(([find, replace]) => {
      if (content.includes(find)) {
        content = content.split(find).join(replace);
        changed = true;
        console.log(`  Replaced: ${find.substring(0, 60)}...`);
      }
    });
    
    if (changed) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Patched: ${filePath}\n`);
    } else {
      console.log(`- No changes needed: ${filePath}\n`);
    }
  } catch (err) {
    console.error(`✗ Error patching ${filePath}: ${err.message}\n`);
  }
});

console.log('✓ Patching complete!');

