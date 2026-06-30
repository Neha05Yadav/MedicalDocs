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
  
  // Match: const IconName = dynamic(() => import("lucide-react/dist/esm/icons/icon-name.mjs"));
  const regex = /const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*dynamic\(\(\)\s*=>\s*import\(['"]lucide-react\/dist\/esm\/icons\/(.*?)(\.mjs)?['"]\)\);/g;
  
  let match;
  let newImports = '';
  let replaced = false;
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
        svgString = svgString.replace('class="lucide-icon"', '{...props}');
        
        newImports += `const ${iconName} = (props: any) => ${svgString};\n`;
        finalContent = finalContent.replace(fullImport, '');
        replaced = true;
      } else {
        console.log(`Icon ${iconName} not found in lucide-react!`);
      }
    }
    
    if (replaced) {
      // Find the last dynamic import or just put it after React
      if (finalContent.includes("import React from 'react';")) {
        finalContent = finalContent.replace("import React from 'react';", "import React from 'react';\n" + newImports);
      } else if (finalContent.includes('import { useState')) {
        finalContent = finalContent.replace('import { useState', newImports + 'import { useState');
      } else if (finalContent.includes('import dynamic from')) {
        finalContent = finalContent.replace('import dynamic from "next/dynamic";', 'import dynamic from "next/dynamic";\n' + newImports);
        finalContent = finalContent.replace("import dynamic from 'next/dynamic';", "import dynamic from 'next/dynamic';\n" + newImports);
      } else {
        finalContent = newImports + finalContent;
      }
      fs.writeFileSync(filePath, finalContent);
      console.log(`Replaced ${matches.length} dynamic icons in ${filePath}`);
    }
  }
}

walkDir('src/app/(authenticated)', processFile);
console.log('Global dynamic optimization complete!');
