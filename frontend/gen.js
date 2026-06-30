const fs = require('fs');
const lucide = require('lucide-react');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

const iconsUsed = [
  'LayoutDashboard', 'ShieldCheck', 'Users', 'Hospital', 'CreditCard', 'ClipboardList',
  'Bell', 'FileText', 'Settings', 'Stethoscope', 'FlaskConical', 'Calendar', 'Pill',
  'User', 'Clock', 'BookOpen', 'RefreshCw', 'Headset', 'MessageSquare', 'AlertTriangle',
  'Activity', 'BarChart3', 'Search'
];

let iconMapCode = 'const IconMap: Record<string, string> = {\n';

for (const iconName of iconsUsed) {
  const IconComponent = lucide[iconName];
  if (IconComponent) {
    const svgElement = React.createElement(IconComponent, { className: 'size-4 shrink-0' });
    const svgString = ReactDOMServer.renderToStaticMarkup(svgElement);
    iconMapCode += `  ${iconName}: \`${svgString}\`,\n`;
  }
}
iconMapCode += '};\n';

const fileContent = `import React from 'react';
import { allNavs } from "./navConfig";

${iconMapCode}

export default function SidebarServerContent() {
  return (
    <>
      {Object.entries(allNavs).map(([groupKey, navArray]) => (
        <div key={groupKey} data-nav-group={groupKey} className="hidden data-[active-group=true]:block space-y-1">
          {navArray.map((item) => {
            const svgString = IconMap[item.iconName] || IconMap.LayoutDashboard;
            return (
              <a 
                key={item.url} 
                href={item.url}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-brand/10 data-[active=true]:text-brand nav-link"
                data-url={item.url}
              >
                 <div dangerouslySetInnerHTML={{ __html: svgString }} className="flex items-center justify-center shrink-0" />
                 <span className="title-span">{item.title}</span>
              </a>
            );
          })}
        </div>
      ))}
    </>
  );
}
`;

fs.writeFileSync('src/app/(authenticated)/SidebarServerContent.tsx', fileContent);
console.log('SidebarServerContent.tsx successfully updated with raw SVG strings!');
