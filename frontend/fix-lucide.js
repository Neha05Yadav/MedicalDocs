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
            
            // Match the bulk import from lucide-react
            const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];/g;
            let match;
            let modified = false;
            
            content = content.replace(importRegex, (match, iconsStr) => {
                modified = true;
                const icons = iconsStr.split(',').map(i => i.trim()).filter(i => i);
                
                return icons.map(icon => {
                    // Convert PascalCase to kebab-case
                    const kebab = icon.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/^-/, '');
                    return `import ${icon} from "lucide-react/dist/esm/icons/${kebab}";`;
                }).join('\n');
            });
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed:', fullPath);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
