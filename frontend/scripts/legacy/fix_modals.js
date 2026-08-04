const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;
walkDir('src/app/(authenticated)/hospital', (file) => {
  if (!file.endsWith('.tsx')) return;
  
  let code = fs.readFileSync(file, 'utf8');
  let original = code;
  
  // Replace inner modal wrapper without max-h-[90vh] with max-h-[90vh] overflow-y-auto
  code = code.replace(/className=\"bg-white rounded-2xl max-w-([^ ]+) w-full shadow-([^\"]+) overflow-hidden flex flex-col relative\"/g, 'className=\"bg-white rounded-2xl max-w-$1 w-full shadow-$2 overflow-hidden flex flex-col relative max-h-[90vh] overflow-y-auto\"');
  
  code = code.replace(/className=\"bg-white rounded-2xl shadow-xl w-full max-w-([^ ]+) overflow-hidden flex flex-col animate-in zoom-in-95 duration-200\"/g, 'className=\"bg-white rounded-2xl shadow-xl w-full max-w-$1 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto\"');
  
  code = code.replace(/className=\"bg-white rounded-2xl max-w-([^ ]+) w-full shadow-([^ ]+) overflow-hidden relative\"/g, 'className=\"bg-white rounded-2xl max-w-$1 w-full shadow-$2 overflow-hidden relative max-h-[90vh] overflow-y-auto\"');
  
  if (code !== original) {
    fs.writeFileSync(file, code);
    console.log('Updated', file);
    count++;
  }
});
console.log('Fixed hospital files:', count);
