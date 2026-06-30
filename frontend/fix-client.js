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
            if (content.includes('"use client"') || content.includes("'use client'")) {
                const lines = content.split('\n');
                let clientLineIndex = -1;
                
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('"use client"') || lines[i].includes("'use client'")) {
                        clientLineIndex = i;
                        break;
                    }
                }
                
                if (clientLineIndex > 0) {
                    // Extract the line and put it at the very top
                    const clientLine = lines.splice(clientLineIndex, 1)[0];
                    lines.unshift(clientLine);
                    fs.writeFileSync(fullPath, lines.join('\n'));
                    console.log('Fixed use client in:', fullPath);
                }
            }
        }
    }
}
processDirectory(path.join(__dirname, 'src'));
