const fs = require('fs');

function replaceIcons(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const regex = /import\s+([A-Z][a-zA-Z0-9_]*)\s+from\s+["']lucide-react[^"']*["'];/g;
  let newImports = '';
  
  content = content.replace(regex, (match, iconName) => {
    newImports += `const ${iconName} = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>;\n`;
    return '';
  });

  if (newImports) {
    if (content.includes("import React from 'react';")) {
      content = content.replace("import React from 'react';", "import React from 'react';\n" + newImports);
    } else {
      content = newImports + content;
    }
    fs.writeFileSync(filePath, content);
    console.log('Replaced icons in', filePath);
  } else {
    console.log('No icons found in', filePath);
  }
}

replaceIcons('src/app/(authenticated)/patient/overview/page.tsx');
replaceIcons('src/app/(authenticated)/patient/overview/UploadReportClient.tsx');
