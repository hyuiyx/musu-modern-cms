import fs from 'node:fs';
function patch(path, fn){const a=fs.readFileSync(path,'utf8'),b=fn(a);fs.writeFileSync(path,b);console.log(path,a===b?'ready':'updated')}
patch('public/admin.html',html=>{
 html=html.replace(/<link[^>]+admin-inquiries\.css[^>]*>\s*/g,'').replace(/<script[^>]+admin-inquiries\.js[^>]*><\/script>\s*/g,'');
 html=html.replace('</head>','<link rel="stylesheet" href="/admin-inquiries.css?v=524">\n</head>');
 html=html.replace('</body>','<script src="/admin-inquiries.js?v=524"></script>\n</body>');
 return html;
});
patch('src/index.js',js=>{
 js=js.replace(/<link rel="stylesheet" href="\/site\.css(?:\?v=\d+)?">/g,'<link rel="stylesheet" href="/site.css?v=524">');
 js=js.replace(/<script src="\/site\.js(?:\?v=\d+)?"><\/script>/g,'<script src="/site.js?v=524"></script>');
 if(!js.includes("'/admin-inquiries.js'"))js=js.replace(/(['"])\/admin\.js\1/,m=>`${m},'/admin-inquiries.js','/admin-inquiries.css'`);
 return js;
});
