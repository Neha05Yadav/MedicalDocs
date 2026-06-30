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
            
            // Match our deep imports
            const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]lucide-react\/dist\/esm\/icons\/[^'"]+['"];/g;
            let match;
            let icons = [];
            let modified = false;
            
            while ((match = importRegex.exec(content)) !== null) {
                icons.push(match[1]);
                modified = true;
            }
            
            if (modified) {
                // Remove all deep imports
                content = content.replace(importRegex, '').replace(/\n\s*\n/g, '\n');
                
                // Prepend bulk import
                const bulkImport = `import { ${icons.join(', ')} } from "lucide-react";\n`;
                content = bulkImport + content;
                fs.writeFileSync(fullPath, content);
                console.log('Reverted:', fullPath);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
