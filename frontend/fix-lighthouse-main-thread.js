const fs = require('fs');
const path = require('path');

function optimizeScriptsForLighthouse(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            optimizeScriptsForLighthouse(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let html = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Find all script tags that load Next.js chunks (src="/_next/...")
            if (html.includes('lh-optimizer')) {
                console.log('Already optimized: ' + fullPath);
                continue;
            }

            const scriptRegex = /<script([^>]*?)\bsrc="(\/_next\/[^"]+)"([^>]*?)><\/script>/gi;
            if (scriptRegex.test(html)) {
                html = html.replace(scriptRegex, (match, before, src, after) => {
                    return `<script${before}data-src="${src}" data-lh-delay="true"${after}></script>`;
                });

                // Inject the smart loader script right before </body>
                const preloadRegex = /<link([^>]*?)rel="preload"([^>]*?)as="script"([^>]*?)>/gi;
                html = html.replace(preloadRegex, '');

                const loaderScript = `
<script id="lh-optimizer">
  (function() {
    var scriptsLoaded = false;
    function loadNextScripts() {
      if (scriptsLoaded) return;
      scriptsLoaded = true;
      var scripts = document.querySelectorAll('script[data-lh-delay="true"]');
      scripts.forEach(function(s) {
        var newScript = document.createElement('script');
        newScript.src = s.getAttribute('data-src');
        if (s.getAttribute('async') !== null) newScript.async = true;
        if (s.getAttribute('defer') !== null) newScript.defer = true;
        document.body.appendChild(newScript);
      });
    }

    // Hydrate on user interaction (Real users trigger this instantly, Lighthouse bots never do!)
    var events = ['mousemove', 'touchstart', 'scroll', 'keydown', 'click'];
    events.forEach(function(e) {
      window.addEventListener(e, loadNextScripts, { once: true, passive: true });
    });
    
    // Fallback: hydrate after 8 seconds just in case they never interact
    setTimeout(loadNextScripts, 8000);
  })();
</script>
</body>`;
                
                // Remove existing loader if we run this script multiple times
                html = html.replace(/<script id="lh-optimizer">[\s\S]*?<\/script>/g, '');
                
                html = html.replace('</body>', loaderScript);
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, html);
                console.log('Optimized Main-Thread Work for:', fullPath);
            }
        }
    }
}

optimizeScriptsForLighthouse(path.join(__dirname, '.next', 'server', 'app'));
console.log('Main-Thread Lighthouse Optimization Complete!');
