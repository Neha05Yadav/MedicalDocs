const fs = require('fs');
const files = [
  './src/app/(authenticated)/management/support/page.tsx',
  './src/app/(authenticated)/management/super-admin/page.tsx',
  './src/app/(authenticated)/management/admin/page.tsx',
  './src/app/(authenticated)/management/sales/page.tsx',
  './src/app/(authenticated)/management/accounts/page.tsx'
];
for(const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/redirect\('\/(.*?)\/overview'\);/g, "redirect('/management/$1/overview');");
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
