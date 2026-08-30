import fs from 'node:fs';
function patch(path, fn){const before=fs.readFileSync(path,'utf8');const after=fn(before);if(after!==before)fs.writeFileSync(path,after);console.log(`${path}: ${after===before?'already patched':'patched'}`)}
patch('public/admin.html',s=>{
  if(!s.includes('/admin-v433.css'))s=s.replace('</head>','<link rel="stylesheet" href="/admin-v433.css">\n</head>');
  if(!s.includes('/admin-v433.js'))s=s.replace('</body>','<script src="/admin-v433.js"></script>\n</body>');
  return s;
});
patch('src/index.js',s=>{
  if(!s.includes("from './v433-api.js'"))s=`import {v433Api} from './v433-api.js';\n${s}`;
  if(!s.includes('const v433Response=await v433Api')){
    const marker="if(u.hostname!==env.ADMIN_HOST)return J({error:'Forbidden'},403);";
    if(!s.includes(marker))throw new Error('Cannot find ADMIN_HOST API marker in src/index.js');
    s=s.replace(marker,`${marker}const v433Response=await v433Api(req,env,u);if(v433Response)return v433Response;`);
  }
  const staticMarker="'/admin.js','/robots.txt'";
  if(!s.includes("'/admin-v433.js'")){
    if(!s.includes(staticMarker))throw new Error('Cannot find static asset marker in src/index.js');
    s=s.replace(staticMarker,"'/admin.js','/admin-v433.js','/admin-v433.css','/robots.txt'");
  }
  // Add saved focal position to Hero images produced by the legacy template.
  s=s.replace(/<img src="\/media\/\$\{esc\(x\.image_key\)\}"(?! style=)/g,'<img src="/media/${esc(x.image_key)}" style="object-position:${Number(x.image_position_x)||50}% ${Number(x.image_position_y)||50}%"');
  return s;
});
