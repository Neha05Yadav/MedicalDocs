const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/(authenticated)/Sidebar.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all icon: X with icon: Circle
content = content.replace(/icon:\s+[a-zA-Z]+/g, 'icon: Circle');

fs.writeFileSync(filePath, content);
console.log('Fixed icons in Sidebar.tsx');
