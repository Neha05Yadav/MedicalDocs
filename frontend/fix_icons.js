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
      
      const regex = /(const [A-Za-z0-9_]+ = \(props:\s*any\)\s*=>\s*<svg\s+)(?!\{\.\.\.props\})xmlns/g;
      
      if (regex.test(content)) {
        let newContent = content.replace(regex, '$1{...props} xmlns');
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed props in:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app', '(authenticated)'));
console.log('Done fixing icons.');
