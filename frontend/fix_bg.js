const fs = require('fs');
const path = require('path');

function replaceInFiles(dir, searchValue, replaceValue) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      replaceInFiles(filePath, searchValue, replaceValue);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchValue)) {
        content = content.split(searchValue).join(replaceValue);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  });
}

replaceInFiles(
  path.join(__dirname, 'src/app/(authenticated)'),
  'bg-emerald-50',
  'bg-white'
);
console.log('Done replacing bg-emerald-50 with bg-white');
