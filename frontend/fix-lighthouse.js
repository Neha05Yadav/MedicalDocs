const fs = require('fs');
const path = require('path');

function fixLighthouseIssues(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixLighthouseIssues(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let html = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // 1. Remove Legacy JavaScript (noModule scripts)
            // Example: <script src="/_next/static/chunks/0cz1d0mv5g_q7.js" noModule=""></script>
            const noModuleRegex = /<script[^>]*noModule=""[^>]*><\/script>/gi;
            if (noModuleRegex.test(html)) {
                html = html.replace(noModuleRegex, '');
                modified = true;
            }

            // 2. Fix Render-blocking CSS requests
            // Find: <link rel="stylesheet" href="/_next/static/css/..." />
            const cssRegex = /<link rel="stylesheet" href="(\/_next\/static\/chunks\/[^"]+\.css)"[^>]*>/g;
            let match;
            const matches = [];
            while ((match = cssRegex.exec(html)) !== null) {
                matches.push(match);
            }
            
            // We read them backwards so replacing doesn't mess up the indices (though we use replace(string), so it's fine)
            for (const m of matches) {
                const linkTag = m[0];
                const href = m[1]; 
                
                const cssFilePath = path.join(__dirname, '.next', href.replace('/_next/', ''));
                if (fs.existsSync(cssFilePath)) {
                    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
                    // Replace link tag with inline style
                    html = html.replace(linkTag, `<style data-href="${href}">${cssContent}</style>`);
                    modified = true;
                }
            }
            
            // Remove preload for css just in case it triggers a warning (optional, but let's keep it safe)
            const cssPreloadRegex = /<link rel="preload" href="(\/_next\/static\/chunks\/[^"]+\.css)" as="style"[^>]*>/g;
            html = html.replace(cssPreloadRegex, '');

            if (modified) {
                fs.writeFileSync(fullPath, html);
                console.log('Fixed Lighthouse issues in:', fullPath);
            }
        }
    }
}

fixLighthouseIssues(path.join(__dirname, '.next', 'server', 'app'));
console.log('Done optimizing for Lighthouse.');
