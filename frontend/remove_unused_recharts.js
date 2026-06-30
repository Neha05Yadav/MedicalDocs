const fs = require('fs');
const path = require('path');

const filesToFix = [
  "src/app/(authenticated)/support/analytics/page.tsx",
  "src/app/(authenticated)/hospital/analytics/page.tsx",
  "src/app/(authenticated)/sales/revenue/page.tsx",
  "src/app/(authenticated)/sales/overview/page.tsx",
  "src/app/(authenticated)/hospital/overview/page.tsx",
  "src/app/(authenticated)/patient/overview/page.tsx",
  "src/app/(authenticated)/laboratory/overview/page.tsx",
  "src/app/(authenticated)/accounts/overview/page.tsx"
];

for (const relPath of filesToFix) {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Find the recharts import
  const rechartsImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]recharts['"];?/g;
  let match = rechartsImportRegex.exec(content);

  if (match) {
    const importedVars = match[1].split(',').map(s => s.trim()).filter(Boolean);
    
    // Check if any of these are actually used in JSX like `<LineChart` or `<Area`
    let isUsed = false;
    for (const v of importedVars) {
      if (content.includes(`<${v}`) || content.includes(` ${v}`)) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      // Just remove the import
      content = content.replace(match[0], '');
      fs.writeFileSync(filePath, content);
      console.log(`Removed unused recharts from ${relPath}`);
    } else {
      console.log(`Recharts is used in ${relPath}. Needs manual extraction.`);
    }
  }
}
