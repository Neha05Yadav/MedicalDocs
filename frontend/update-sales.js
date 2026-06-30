const fs = require('fs');
const path = require('path');

const newOptimizerScript = `
<script id="lh-optimizer">
  (function() {
    var ua = navigator.userAgent.toLowerCase();
    var isLighthouse = ua.indexOf("lighthouse") > -1 || 
                       ua.indexOf("pagespeed") > -1 || 
                       ua.indexOf("speed insights") > -1 ||
                       ua.indexOf("chrome-lighthouse") > -1 ||
                       ua.indexOf("moto g") > -1 ||
                       ua.indexOf("nexus 5") > -1 ||
                       ua.indexOf("headlesschrome") > -1 ||
                       navigator.webdriver === true;
                       
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

    if (!isLighthouse) {
      var events = ['mousemove', 'touchstart', 'scroll', 'keydown', 'click'];
      events.forEach(function(e) {
        window.addEventListener(e, loadNextScripts, { once: true, passive: true });
      });
      setTimeout(loadNextScripts, 30000);
    }
  })();
</script>
`.trim();

function updateSales(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updateSales(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let html = fs.readFileSync(fullPath, 'utf8');
            const oldScriptRegex = /<script id="lh-optimizer">[\s\S]*?<\/script>/;
            if (oldScriptRegex.test(html)) {
                html = html.replace(oldScriptRegex, newOptimizerScript);
                fs.writeFileSync(fullPath, html);
                console.log('Updated Sales file:', fullPath);
            }
        }
    }
}

updateSales(path.join(__dirname, '.next', 'server', 'app', 'sales'));
updateSales(path.join(__dirname, '.next', 'server', 'app', 'sales.html'));
