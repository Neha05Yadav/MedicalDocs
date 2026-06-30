const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace all invalid React SVG attributes with camelCase
  content = content.replace(/class=\"lucide/g, 'className=\"lucide');
  content = content.replace(/stroke-width=/g, 'strokeWidth=');
  content = content.replace(/stroke-linecap=/g, 'strokeLinecap=');
  content = content.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  content = content.replace(/fill-rule=/g, 'fillRule=');
  content = content.replace(/clip-rule=/g, 'clipRule=');
  content = content.replace(/stroke-dasharray=/g, 'strokeDasharray=');
  content = content.replace(/stroke-dashoffset=/g, 'strokeDashoffset=');
  content = content.replace(/stroke-miterlimit=/g, 'strokeMiterlimit=');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed React SVG attributes in ${filePath}`);
  }
}

walkDir('src/app/(authenticated)', processFile);
console.log('Global SVG attribute fix complete!');
