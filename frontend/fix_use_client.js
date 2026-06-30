const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('"use client";') || content.includes("'use client';")) {
    content = content.replace(/"use client";\n?/g, '');
    content = content.replace(/'use client';\n?/g, '');
    content = '"use client";\n' + content;
    fs.writeFileSync(filePath, content);
  }
}

walkDir('src/app/(authenticated)', processFile);
console.log('Fixed use client directives!');
