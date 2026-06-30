const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Match our generated .mjs imports to fix them
            const importRegex = /import\s+([A-Za-z0-9]+)\s+from\s+["']lucide-react\/dist\/esm\/icons\/([^"']+)\.mjs["'];/g;
            let modified = false;
            
            content = content.replace(importRegex, (match, alias, kebab) => {
                // If it ends with a number without a dash, fix it
                let fixedKebab = kebab;
                if (/[a-z][0-9]+$/.test(kebab)) {
                    fixedKebab = kebab.replace(/([a-z])([0-9]+)$/, '$1-$2');
                    modified = true;
                }
                return `import ${alias} from "lucide-react/dist/esm/icons/${fixedKebab}.mjs";`;
            });
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed numeric kebab case in:', fullPath);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
