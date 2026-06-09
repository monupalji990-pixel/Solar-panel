#!/usr/bin/env node

/**
 * Comprehensive Node 12 compatibility patch for @azure/identity
 * Handles optional chaining (?.) and nullish coalescing (??)
 */

const fs = require('fs');
const path = require('path');

function safePatchFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;
  
  // NULLISH COALESCING: Replace ?? with ternary (simpler and safer)
  // Pattern: expr ?? defaultValue
  // We need to be careful to not replace ?? within strings
  
  // Split by lines to avoid breaking within string literals
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip if this line is likely a string
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      continue;
    }
    
    // Handle nullish coalescing (simpler patterns)
    // These are specific patterns found in the codebase
    line = line.replace(/(\w+)\s*\?\?\s*(\{)/g, '(($1) != null ? ($1) : ($2))');
    line = line.replace(/(\w+)\s*\?\?\s*"([^"]*)"/g, '(($1) != null ? ($1) : "$2")');
    line = line.replace(/(\w+)\s*\?\?\s*'([^']*)'/g, "(($1) != null ? ($1) : '$2')");
    line = line.replace(/(\w+)\s*\?\?\s*(\d+)/g, '(($1) != null ? ($1) : $2)');
    line = line.replace(/(\w+)\s*\?\?\s*false/g, '(($1) != null ? ($1) : false)');
    line = line.replace(/(\w+)\s*\?\?\s*true/g, '(($1) != null ? ($1) : true)');
    line = line.replace(/(\w+)\s*\?\?\s*\[\]/g, '(($1) != null ? ($1) : [])');
    line = line.replace(/(\w+)\s*\?\?\s*(\w+)\b/g, '(($1) != null ? ($1) : $2)');
    
    // Now handle optional chaining for single properties (most common)
    // Pattern: obj?.prop → (obj != null ? obj.prop : undefined)
    // Be conservative and look for clear patterns
    
    // Pattern: (identifier).?.property
    line = line.replace(/(\w+)\?\.(\w+)\b(?!\()/g, '(($1) != null ? ($1).$2 : undefined)');
    
    // Pattern: ?.method() 
    line = line.replace(/(\w+)\?\.(\w+)\(/g, '(($1) != null ? ($1).$2( : undefined');
    
    // Pattern: globalThis.process?.env?.AZURE_...
    line = line.replace(/globalThis\.process\?\.env/g, '(typeof globalThis !== "undefined" && globalThis.process != null ? globalThis.process.env : undefined)');
    
    // Pattern: headers.get()?.split() - method call result chaining
    line = line.replace(/(\))\?\.(\w+)\(/g, '($1 != null ? ($1).$2( : undefined');
    
    lines[i] = line;
  }
  
  content = lines.join('\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

const baseDir = path.join(__dirname, 'node_modules/@azure/identity/dist/commonjs');

function patchAllFiles(dir) {
  let patchedCount = 0;
  
  const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkSync(filePath);
      } else if (file.endsWith('.js')) {
        try {
          if (safePatchFile(filePath)) {
            const relPath = path.relative(process.cwd(), filePath);
            console.log(`✓ ${relPath}`);
            patchedCount++;
          }
        } catch (err) {
          console.error(`✗ Error: ${file}: ${err.message}`);
        }
      }
    });
  };
  
  walkSync(dir);
  return patchedCount;
}

console.log('Patching @azure/identity for Node 12 compatibility\n');
const count = patchAllFiles(baseDir);
console.log(`\n✓ Patched ${count} files`);

process.exit(0);
