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

  // Replace 'recharts' with '@/components/RechartsWrapper'
  const newContent = content.replace(/from\s+['"]recharts['"]/g, 'from "@/components/RechartsWrapper"');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated imports in ${relPath}`);
  }
}
