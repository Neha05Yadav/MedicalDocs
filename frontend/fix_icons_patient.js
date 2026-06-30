const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const lucide = require('lucide-react');

const targetFile = path.join(__dirname, 'src', 'app', '(authenticated)', 'patient', 'overview', 'page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Regex to find all `const IconName = (props: any) => <svg...`
const regex = /const ([A-Za-z0-9_]+) = \(props: any\) => <svg.*?<\/svg>;/g;

let newContent = content.replace(regex, (match, iconName) => {
  const IconComponent = lucide[iconName];
  if (!IconComponent) {
    console.log("Could not find icon:", iconName);
    return match;
  }
  
  // We just need the inner content of the SVG. We can extract it by rendering.
  const svgString = ReactDOMServer.renderToStaticMarkup(React.createElement(IconComponent));
  
  // It renders <svg ...> <path... /> </svg>
  // We want to replace the whole match with a new one that contains the correct paths, BUT preserves our {...props}
  // Extract inner html of the svg:
  const innerHtmlMatch = svgString.match(/<svg[^>]*>(.*?)<\/svg>/);
  if (innerHtmlMatch && innerHtmlMatch[1]) {
    const innerHtml = innerHtmlMatch[1];
    return `const ${iconName} = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">${innerHtml}</svg>;`;
  }
  return match;
});

fs.writeFileSync(targetFile, newContent);
console.log("Fixed icons in patient/overview/page.tsx");
