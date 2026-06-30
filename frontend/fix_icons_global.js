const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const lucide = require('lucide-react');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /const ([A-Za-z0-9_]+) = \(props: any\) => <svg.*?<\/svg>;/g;
      
      if (regex.test(content)) {
        let newContent = content.replace(regex, (match, iconName) => {
          const IconComponent = lucide[iconName];
          if (!IconComponent) {
            return match;
          }
          
          const svgString = ReactDOMServer.renderToStaticMarkup(React.createElement(IconComponent));
          const innerHtmlMatch = svgString.match(/<svg[^>]*>(.*?)<\/svg>/);
          if (innerHtmlMatch && innerHtmlMatch[1]) {
            const innerHtml = innerHtmlMatch[1];
            return `const ${iconName} = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">${innerHtml}</svg>;`;
          }
          return match;
        });
        
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent);
          console.log("Fixed icons in:", fullPath);
        }
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app', '(authenticated)'));
console.log('Done fixing all icons globally.');
