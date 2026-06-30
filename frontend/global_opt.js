const fs = require('fs');
const path = require('path');
const lucide = require('lucide-react');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Match: import IconName from "lucide-react/dist/esm/icons/icon-name.mjs";
  const regex = /import\s+([A-Z][a-zA-Z0-9_]*)\s+from\s+["']lucide-react\/dist\/esm\/icons\/(.*?)(\.mjs)?["'];/g;
  
  let match;
  let newImports = '';
  let replaced = false;
  
  // We need to loop manually because we might not find the icon in lucide
  let finalContent = content;
  
  const matches = [...content.matchAll(regex)];
  
  if (matches.length > 0) {
    for (const m of matches) {
      const fullImport = m[0];
      const iconName = m[1];
      
      const IconComponent = lucide[iconName];
      if (IconComponent) {
        const svgElement = React.createElement(IconComponent, { className: 'lucide-icon' });
        let svgString = ReactDOMServer.renderToStaticMarkup(svgElement);
        // We need to pass props to the svg, so we replace the hardcoded className with {...props}
        svgString = svgString.replace('class="lucide-icon"', '{...props}');
        
        newImports += `const ${iconName} = (props: any) => ${svgString};\n`;
        finalContent = finalContent.replace(fullImport, '');
        replaced = true;
      } else {
        console.log(`Icon ${iconName} not found in lucide-react!`);
      }
    }
    
    if (replaced) {
      if (finalContent.includes("import React from 'react';")) {
        finalContent = finalContent.replace("import React from 'react';", "import React from 'react';\n" + newImports);
      } else if (finalContent.includes('import { useState')) {
        finalContent = finalContent.replace('import { useState', newImports + 'import { useState');
      } else if (finalContent.includes('import Link')) {
        finalContent = finalContent.replace('import Link', newImports + 'import Link');
      } else if (finalContent.includes('"use client";')) {
        finalContent = finalContent.replace('"use client";', '"use client";\n' + newImports);
      } else {
        finalContent = newImports + finalContent;
      }
      fs.writeFileSync(filePath, finalContent);
      console.log(`Replaced ${matches.length} icons in ${filePath}`);
    }
  }
}

walkDir('src/app/(authenticated)', processFile);
console.log('Global optimization complete!');
