#!/usr/bin/env node

/**
 * Comprehensive patch for @azure/identity Node 12 compatibility
 * Converts optional chaining (?.) and nullish coalescing (??) to Node 12-compatible syntax
 */

const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // CRITICAL: Handle nullish coalescing (??) first, before optional chaining
  // Pattern: value ?? default
  // Replace: ((value) != null ? (value) : (default))
  
  // This regex handles various nullish coalescing patterns
  // It's complex because we need to avoid breaking code
  let depth = 0;
  let result = '';
  let i = 0;
  
  while (i < content.length) {
    // Look for ?? operator
    if (i < content.length - 1 && content[i] === '?' && content[i + 1] === '?') {
      // Found ??, now we need to extract the left and right operands
      // Work backwards to find start of left operand
      let leftEnd = i - 1;
      let leftStart = leftEnd;
      
      // Skip whitespace
      while (leftStart > 0 && /\s/.test(content[leftStart])) {
        leftStart--;
      }
      
      // Find the start of the expression (handle ) first)
      let parenDepth = 0;
      if (content[leftStart] === ')') {
        parenDepth = 1;
        leftStart--;
        while (leftStart > 0 && parenDepth > 0) {
          if (content[leftStart] === ')') parenDepth++;
          if (content[leftStart] === '(') parenDepth--;
          leftStart--;
        }
        leftStart++; // Move to opening paren
      } else if (/\w/.test(content[leftStart])) {
        // Identifier or property access
        while (leftStart > 0 && /[\w\.]/.test(content[leftStart - 1])) {
          leftStart--;
        }
      }
      
      // Skip to after ??
      let rightStart = i + 2;
      while (rightStart < content.length && /\s/.test(content[rightStart])) {
        rightStart++;
      }
      
      // Find the end of right operand
      let rightEnd = rightStart;
      parenDepth = 0;
      if (content[rightEnd] === '(') {
        parenDepth = 1;
        rightEnd++;
        while (rightEnd < content.length && parenDepth > 0) {
          if (content[rightEnd] === '(') parenDepth++;
          if (content[rightEnd] === ')') parenDepth--;
          rightEnd++;
        }
      } else if (/\w|'|"|\[/.test(content[rightEnd])) {
        // Handle string, number, property access, array, etc.
        while (rightEnd < content.length) {
          const c = content[rightEnd];
          if (/[\s,;\)}]/.test(c)) break;
          rightEnd++;
        }
      }
      
      const leftOp = content.substring(leftStart, i);
      const rightOp = content.substring(rightStart, rightEnd);
      
      // Only replace if we found valid operands
      if (leftOp.trim().length > 0 && rightOp.trim().length > 0) {
        result += `((${leftOp}) != null ? (${leftOp}) : (${rightOp}))`;
        i = rightEnd;
      } else {
        result += content[i];
        i++;
      }
    } else {
      result += content[i];
      i++;
    }
  }
  
  content = result;

  // Now handle optional chaining (?.)
  // This is also complex because of chaining: a?.b?.c
  
  // Simple approach: replace specific patterns found in the code
  const chainingReplacements = [
    // Optional property access chains
    [/(\w+)\?\.(\w+)\?\.(\w+)/g, '(($1 != null ? $1.$2 : null) != null ? ($1 != null ? $1.$2 : null).$3 : undefined)'],
    [/(\w+)\?\.(\w+)\?\.(\w+)\?\.(\w+)/g, '(((($1 != null ? $1.$2 : null) != null ? ($1 != null ? $1.$2 : null).$3 : null) != null ? (($1 != null ? $1.$2 : null) != null ? ($1 != null ? $1.$2 : null).$3 : null).$4 : undefined))'],
    // Double chaining  
    [/(\w+)\?\.(\w+)\?\.(\w+)(?!\()/g, '(($1 != null ? $1.$2 : null) != null ? ($1.$2).$3 : undefined)'],
    // Single property access with optional
    [/(\w+)\?\.(\w+)(?!\(|\.)/g, '($1 != null ? $1.$2 : undefined)'],
    // Optional method calls
    [/(\w+)\?\.(\w+)\(/g, '($1 != null ? $1.$2( : undefined'],
    // Handle property access on results: res.headers.get("authorization")?.split
    [/(\))\?\.(\w+)\(/g, '(($1) != null ? ($1).$2( : undefined'],
  ];

  chainingReplacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Find and patch all .js files in @azure/identity/dist/commonjs
const baseDir = path.join(__dirname, 'node_modules/@azure/identity/dist/commonjs');

function walkDir(dir) {
  let patched = 0;
  
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return patched;
  }

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      patched += walkDir(filePath);
    } else if (file.endsWith('.js')) {
      try {
        if (patchFile(filePath)) {
          console.log(`✓ Patched: ${path.relative(process.cwd(), filePath)}`);
          patched++;
        }
      } catch (err) {
        console.error(`✗ Error patching ${filePath}: ${err.message}`);
      }
    }
  });
  
  return patched;
}

console.log('Patching @azure/identity for Node 12 compatibility...\n');
const patchedCount = walkDir(baseDir);
console.log(`\n✓ Successfully patched ${patchedCount} files`);
