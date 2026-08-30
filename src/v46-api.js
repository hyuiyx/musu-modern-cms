// SMUSU CMS V4.3.3 API module

let schemaReady=false;
async function ensureV46Schema(env){
  if(schemaReady)return;
  const add=async(table,column,definition)=>{
    const cols=await rows(env.DB,`PRAGMA table_info(${table})`);
    if(!cols.some(c=>c.name===column))await env.DB.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
  };
  await add('hero_slides','image_position_x','INTEGER NOT NULL DEFAULT 50');
  await add('hero_slides','image_position_y','INTEGER NOT NULL DEFAULT 50');
  await add('hero_slides','image_fit','TEXT NOT NULL DEFAULT "cover"');
  await add('videos','poster_key','TEXT NOT NULL DEFAULT ""');
  await add('videos','mime_type','TEXT NOT NULL DEFAULT ""');
  await add('videos','file_size','INTEGER NOT NULL DEFAULT 0');
  await add('videos','sort_order','INTEGER NOT NULL DEFAULT 0');
  await add('videos','created_at','TEXT');
  await add('videos','updated_at','TEXT');
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_videos_status_sort ON videos(status,sort_order,id)').run();
  schemaReady=true;
}

const J=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const one=(db,sql,...a)=>db.prepare(sql).bind(...a).first();
const rows=async(db,sql,...a)=>(await db.prepare(sql).bind(...a).all()).results||[];
const clamp=v=>Math.max(0,Math.min(100,parseInt(v,10)||50));
const slugify=(v='')=>String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const valid=f=>f&&typeof f!=='string'&&f.size>0;
const videoTypes=new Set(['video/mp4','video/webm','video/ogg','video/quicktime']);
const imageTypes=new Set(['image/jpeg','image/png','image/webp','image/gif']);
async function digest(f){const b=await f.arrayBuffer(),h=await crypto.subtle.digest('SHA-256',b);return{b,x:[...new Uint8Array(h)].map(v=>v.toString(16).padStart(2,'0')).join('')}}
async function upload(f,env,p='media'){const {b,x}=await digest(f),hit=await one(env.DB,'SELECT * FROM media_assets WHERE file_hash=?',x);if(hit)return{...hit,reused:true};const ext=(f.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,''),k=`${p}/${x.slice(0,2)}/${x}.${ext}`;await env.MEDIA.put(k,b,{httpMetadata:{contentType:f.type}});const r=await env.DB.prepare('INSERT INTO media_assets(object_key,file_hash,file_name,mime_type,file_size) VALUES(?,?,?,?,?)').bind(k,x,f.name,f.type,f.size).run();return{id:r.meta.last_row_id,object_key:k,reused:false}}
async function uniqueSlug(env,wanted,id=0){const base=slugify(wanted)||`video-${Date.now()}`;let s=base,n=2;while(await one(env.DB,'SELECT id FROM videos WHERE slug=? AND id<>?',s,id))s=`${base}-${n++}`;return s}
export async function v46Api(req,env,u){await ensureV46Schema(env);let m;
  // HERO: this must run before the old hero POST routes.
  m=u.pathname.match(/^\/api\/admin\/hero(?:\/(\d+))?$/);
  if(m&&req.method==='POST'){
    const id=m[1]?Number(m[1]):0,fd=await req.formData(),old=id?await one(env.DB,'SELECT * FROM hero_slides WHERE id=?',id):null;
    if(id&&!old)return J({error:'Hero not found'},404);
    const f=fd.get('image');if(valid(f)&&f.size>5*1048576)return J({error:'Hero image must be 5 MB or smaller'},400);if(valid(f)&&!imageTypes.has(f.type))return J({error:'Hero image must be JPG, PNG, WebP or GIF'},400);
    let key=old?.image_key||'',reused=false;if(valid(f)){const a=await upload(f,env,'hero');key=a.object_key;reused=a.reused}
    const values=[String(fd.get('title')||''),String(fd.get('subtitle')||''),key,String(fd.get('button1_text')||'Explore Products'),String(fd.get('button1_url')||'/products/'),String(fd.get('button2_text')||'Request a Quote'),String(fd.get('button2_url')||'/feedback/'),+String(fd.get('sort_order')||0),String(fd.get('status')||'published'),clamp(fd.get('image_position_x')),clamp(fd.get('image_position_y'))];
    if(id){await env.DB.prepare('UPDATE hero_slides SET title=?,subtitle=?,image_key=?,button1_text=?,button1_url=?,button2_text=?,button2_url=?,sort_order=?,status=?,image_position_x=?,image_position_y=? WHERE id=?').bind(...values,id).run();return J({success:true,id,image_key:key,reused,image_position_x:values[9],image_position_y:values[10]})}
    const r=await env.DB.prepare('INSERT INTO hero_slides(title,subtitle,image_key,button1_text,button1_url,button2_text,button2_url,sort_order,status,image_position_x,image_position_y) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(...values).run();return J({success:true,id:r.meta.last_row_id,image_key:key,reused,image_position_x:values[9],image_position_y:values[10]})
  }
  if(u.pathname==='/api/admin/videos'&&req.method==='GET')return J(await rows(env.DB,'SELECT * FROM videos ORDER BY sort_order,id DESC'));
  if(u.pathname==='/api/admin/videos'&&req.method==='POST'){
    const fd=await req.formData(),f=fd.get('file');if(!valid(f))return J({error:'请选择视频文件'},400);if(!videoTypes.has(f.type))return J({error:'仅支持 MP4、WebM、OGG 或 MOV'},400);if(f.size>100*1048576)return J({error:'视频不能超过 100 MB'},400);
    const title=String(fd.get('title')||'').trim();if(!title)return J({error:'标题不能为空'},400);const a=await upload(f,env,'videos'),poster=fd.get('poster');let pk='';if(valid(poster)){if(!imageTypes.has(poster.type)||poster.size>5*1048576)return J({error:'封面须为 5 MB 以内的图片'},400);pk=(await upload(poster,env,'video-posters')).object_key}
    const now=new Date().toISOString(),slug=await uniqueSlug(env,String(fd.get('slug')||title));const r=await env.DB.prepare('INSERT INTO videos(title,slug,description,video_key,poster_key,mime_type,file_size,sort_order,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(title,slug,String(fd.get('description')||''),a.object_key,pk,f.type,f.size,+String(fd.get('sort_order')||0),String(fd.get('status')||'draft'),now,now).run();return J({id:r.meta.last_row_id,reused:a.reused})
  }
  m=u.pathname.match(/^\/api\/admin\/videos\/(\d+)$/);
  if(m&&req.method==='POST'){
    const id=Number(m[1]),old=await one(env.DB,'SELECT * FROM videos WHERE id=?',id);if(!old)return J({error:'Video not found'},404);const fd=await req.formData(),f=fd.get('file'),poster=fd.get('poster');let key=old.video_key,mime=old.mime_type||'',size=old.file_size||0,pk=old.poster_key||'',reused=false;
    if(valid(f)){if(!videoTypes.has(f.type)||f.size>100*1048576)return J({error:'视频格式不支持或超过 100 MB'},400);const a=await upload(f,env,'videos');key=a.object_key;mime=f.type;size=f.size;reused=a.reused}if(valid(poster)){if(!imageTypes.has(poster.type)||poster.size>5*1048576)return J({error:'封面须为 5 MB 以内的图片'},400);pk=(await upload(poster,env,'video-posters')).object_key}if(String(fd.get('remove_poster')||'')==='1')pk='';const title=String(fd.get('title')||old.title).trim(),slug=await uniqueSlug(env,String(fd.get('slug')||title),id);await env.DB.prepare('UPDATE videos SET title=?,slug=?,description=?,video_key=?,poster_key=?,mime_type=?,file_size=?,sort_order=?,status=?,updated_at=? WHERE id=?').bind(title,slug,String(fd.get('description')||''),key,pk,mime,size,+String(fd.get('sort_order')||0),String(fd.get('status')||'draft'),new Date().toISOString(),id).run();return J({success:true,id,reused})
  }
  if(m&&req.method==='DELETE'){
    const id=Number(m[1]),v=await one(env.DB,'SELECT * FROM videos WHERE id=?',id);if(!v)return J({error:'Video not found'},404);for(const key of [v.video_key,v.poster_key].filter(Boolean)){await env.MEDIA.delete(key);const ref=await one(env.DB,'SELECT COUNT(*) n FROM videos WHERE id<>? AND (video_key=? OR poster_key=?)',id,key,key);if(!ref||Number(ref.n)===0)await env.DB.prepare('DELETE FROM media_assets WHERE object_key=?').bind(key).run()}await env.DB.prepare('DELETE FROM videos WHERE id=?').bind(id).run();return J({success:true})
  }
  return null;
}
export const heroObjectPosition=h=>`${clamp(h.image_position_x)}% ${clamp(h.image_position_y)}%`;
