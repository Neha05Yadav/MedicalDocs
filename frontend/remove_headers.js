const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;

      // Handle simple headers like:
      // <div className="flex justify-between items-center">
      //   <h1 className="text-2xl font-bold text-slate-900">Escalation Management</h1>
      const regex1 = /<div className="flex justify-between items-center">\s*<h[12][^>]*>.*?<\/h[12]>/g;
      if (regex1.test(content)) {
        content = content.replace(regex1, '<div className="flex justify-end items-center">');
        modified = true;
      }
      
      const regex2 = /<div className="flex justify-between items-center mb-6">\s*<h[12][^>]*>.*?<\/h[12]>/g;
      if (regex2.test(content)) {
        content = content.replace(regex2, '<div className="flex justify-end items-center mb-6">');
        modified = true;
      }
      
      // Also check profile pages, which might have titles differently. Let's not blindly remove those if they are the main profile title.
      // But the user said "saare modules se". Let's run this.

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app', '(authenticated)'));
console.log('Done');
