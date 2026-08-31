import fs from 'node:fs';
const htmlPath='public/admin.html', jsPath='src/index.js';
let html=fs.readFileSync(htmlPath,'utf8');
html=html.replace(/<link[^>]+admin-inquiries\.css[^>]*>\s*/g,'').replace(/<script[^>]+admin-inquiries\.js[^>]*><\/script>\s*/g,'');
html=html.replace('</head>','<link rel="stylesheet" href="/admin-inquiries.css?v=523">\n</head>').replace('</body>','<script src="/admin-inquiries.js?v=523"></script>\n</body>');
fs.writeFileSync(htmlPath,html);
let js=fs.readFileSync(jsPath,'utf8');
if(!js.includes("'/admin-inquiries.js'")){js=js.replace(/(['"])\/admin\.js\1/,m=>`${m},'/admin-inquiries.js','/admin-inquiries.css'`)}
fs.writeFileSync(jsPath,js);
console.log('V5.2.3 inquiry assets connected');
