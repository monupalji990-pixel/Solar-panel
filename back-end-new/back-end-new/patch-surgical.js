#!/usr/bin/env node

/**
 * Safe surgical patch for @azure/identity Node 12 compatibility
 * Uses exact string matching for reliable, targeted replacements
 */

const fs = require('fs');
const path = require('path');

const filesToPatch = [
  {
    file: 'node_modules/@azure/identity/dist/commonjs/msal/nodeFlows/msalPlugins.js',
    patches: [
      {
        old: 'isEnabled: options.brokerOptions?.enabled ?? false,',
        new: 'isEnabled: (options.brokerOptions != null ? options.brokerOptions.enabled : false),'
      },
      {
        old: 'enableMsaPassthrough: options.brokerOptions?.legacyEnableMsaPassthrough ?? false,',
        new: 'enableMsaPassthrough: (options.brokerOptions != null ? options.brokerOptions.legacyEnableMsaPassthrough : false),'
      },
      {
        old: 'if (options.tokenCachePersistenceOptions?.enabled) {',
        new: 'if ((options.tokenCachePersistenceOptions != null ? options.tokenCachePersistenceOptions.enabled : false)) {'
      },
      {
        old: 'if (options.brokerOptions?.enabled) {',
        new: 'if ((options.brokerOptions != null ? options.brokerOptions.enabled : false)) {'
      }
    ]
  },
];

console.log('Applying surgical patches to @azure/identity for Node 12...\n');

let totalPatches = 0;

filesToPatch.forEach(({file, patches}) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⊘ File not found: ${file}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let patchCount = 0;

    patches.forEach(({old, new: replacement}) => {
      if (content.includes(old)) {
        content = content.replace(old, replacement);
        patchCount++;
        console.log(`  Replaced: ${old.substring(0, 50)}...`);
      }
    });

    if (patchCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Patched ${file} (${patchCount} replacements)\n`);
      totalPatches += patchCount;
    }
  } catch (err) {
    console.error(`✗ Error patching ${file}: ${err.message}\n`);
  }
});

console.log(`✓ Complete! Applied ${totalPatches} patches`);
