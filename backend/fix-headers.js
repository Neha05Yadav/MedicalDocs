const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/neha yadav/Desktop/Medidoc/Medidoc-/frontend/src/app/(authenticated)/laboratory');

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let modified = false;

  code = code.replace(/fetch\(\s*([`"'][^`"']+[`"'])\s*\)/g, (match, url) => {
    modified = true;
    return `fetch(${url}, { headers: { "Authorization": \`Bearer \${localStorage.getItem("token")}\` } })`;
  });

  code = code.replace(/fetch\(\s*([`"'][^`"']+[`"'])\s*,\s*\{([\s\S]*?)\}\s*\)/g, (match, url, options) => {
    if (!options.includes('Authorization')) {
      modified = true;
      if (options.includes('headers: {')) {
        return match.replace('headers: {', 'headers: { "Authorization": \`Bearer \${localStorage.getItem("token")}\`,');
      } else {
        return `fetch(${url}, {${options}, headers: { "Authorization": \`Bearer \${localStorage.getItem("token")}\` } })`;
      }
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(file, code);
    console.log('Fixed', file);
  }
});
