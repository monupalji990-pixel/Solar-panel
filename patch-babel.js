#!/usr/bin/env node

/**
 * Babel-based transpilation for @azure/identity Node 12 compatibility
 */

const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'node_modules/@azure/identity/dist/commonjs');

const babelConfig = {
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ]
};

function transpileFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = babel.transformSync(code, babelConfig);
    
    if (result.code !== code) {
      fs.writeFileSync(filePath, result.code, 'utf8');
      return true;
    }
  } catch (err) {
    console.error(`Error transpiling ${filePath}:`, err.message);
    return false;
  }
  return false;
}

function walkDir(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.js')) {
      if (transpileFile(filePath)) {
        console.log(`✓ Transpiled: ${path.relative(process.cwd(), filePath)}`);
        count++;
      }
    }
  });
  
  return count;
}

console.log('Transpiling @azure/identity for Node 12 compatibility with Babel\n');
const count = walkDir(baseDir);
console.log(`\n✓ Transpiled ${count} files`);
