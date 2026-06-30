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
            let modified = false;
            
            content = content.replace(importRegex, (match, iconsStr) => {
                modified = true;
                const icons = iconsStr.split(',').map(i => i.trim()).filter(i => i);
                
                return icons.map(icon => {
                    // Convert PascalCase to kebab-case
                    const kebab = icon.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/^-/, '');
                    
                    // Handle "as" syntax (e.g., Image as ImageIcon)
                    if (icon.includes(' as ')) {
                        const [original, alias] = icon.split(' as ').map(i => i.trim());
                        const originalKebab = original.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/^-/, '');
                        return `import ${alias} from "lucide-react/dist/esm/icons/${originalKebab}.mjs";`;
                    }
                    
                    return `import ${icon} from "lucide-react/dist/esm/icons/${kebab}.mjs";`;
                }).join('\n');
            });
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed deep import in:', fullPath);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
