const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu +'}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.textContent=open?'Close −':'Menu +'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.getElementById('year').textContent=new Date().getFullYear();

// One distinct, undirected connection for each of the six possible pairs.
const pairData={
 '0-1':{title:'Learning without starting over',why:'Complementary learning systems connect a biological problem to a computational one: how to learn new episodes quickly without disrupting established knowledge. Models pair a fast memory system with slower integration, giving AI a concrete hypothesis about how to balance adaptation and retention.',question:'When does a separate memory and replay system improve continual learning, compared with changing a single network’s weights?',limit:'This is a modelling hypothesis inspired by biology, not a claim that an artificial replay buffer reproduces the hippocampus.'},
 '0-2':{title:'From a decision to a mechanism',why:'Cognitive models describe processes such as accumulating noisy evidence until a decision threshold is reached. Neuroscience asks how such computations could be implemented. Behavioural predictions about accuracy and response time can therefore constrain the neural mechanism we look for.',question:'Could the same evidence-accumulation model explain both a person’s choices and the time they take to make them?',limit:'A model that fits behaviour does not by itself identify the neural circuit that implements it.'},
 '0-3':{title:'What neural evidence can tell us about experience',why:'Neuroscience can investigate which brain processes track changes in conscious experience. Philosophy of mind helps separate the claims involved: a correlate, a necessary condition and an explanation are different things. The connection matters when deciding what an experiment actually establishes.',question:'If disrupting a neural process changes reported experience, what further evidence would show that it is part of consciousness rather than a prerequisite for reporting?',limit:'Even strong neural evidence need not settle every philosophical question about why experience exists.'},
 '1-2':{title:'Learning a task versus understanding its structure',why:'Cognitive science supplies questions about how people generalise from limited experience, combine familiar parts in new ways and use causal knowledge. AI makes candidate explanations executable: a model can be tested on unfamiliar combinations rather than only on examples like its training data.',question:'What would let a model reuse a learned concept in a genuinely different situation?',limit:'Matching human task performance is useful evidence, but it does not establish that the model uses the same strategy.'},
 '1-3':{title:'What would justify attributing experience to AI?',why:'AI makes the distinction between intelligent behaviour and subjective experience difficult to avoid. Philosophy clarifies what is being attributed; computational theories suggest properties we might examine. Together, they motivate explicit criteria instead of treating fluent conversation as sufficient evidence.',question:'Which architectural or computational features would change our confidence that a system could have experience, and why?',limit:'Theory-derived indicators are conditional evidence. They are not a settled test for consciousness.'},
 '2-3':{title:'What do we mean by a mental representation?',why:'Cognitive science often explains behaviour using representations, beliefs or goals. Philosophy asks what gives those states their content and what makes them explanatory. That helps distinguish a model that predicts a response from a claim about what a person represents.',question:'When is it justified to say that a model represents something, rather than merely responding reliably to it?',limit:'There are competing accounts of representation; the connection is a way to clarify assumptions, not resolve them by definition.'}
};
const map=document.getElementById('field-map');
if(map){
 const names=['Neuroscience','Artificial intelligence','Cognitive science','Philosophy of mind'],coords=[[110,80],[390,80],[110,320],[390,320]],buttons=[...map.querySelectorAll('.field-node')],line=document.getElementById('pair-line'),preview=document.getElementById('drag-line'),status=document.getElementById('map-status');
 let selected=[0,1],pending=null,drag=null,suppressClick=false;
 function draw(el,a,b){['x1','y1','x2','y2'].forEach((k,i)=>el.setAttribute(k,[...a,...b][i]))}
 function resetPending(){pending=null;buttons.forEach(b=>b.classList.remove('start-node'));preview.setAttribute('visibility','hidden');buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(selected.includes(i))));line.setAttribute('visibility','visible')}
 function showPair(a,b){if(a===b)return;selected=[a,b].sort((x,y)=>x-y);const d=pairData[selected.join('-')];resetPending();line.setAttribute('visibility','visible');draw(line,coords[a],coords[b]);buttons.forEach((n,i)=>n.setAttribute('aria-pressed',String(selected.includes(i))));document.getElementById('pair-fields').textContent=selected.map(i=>names[i]).join(' ↔ ');document.getElementById('pair-title').textContent=d.title;document.getElementById('pair-why').textContent=d.why;document.getElementById('pair-question').textContent=d.question;document.getElementById('pair-limit').textContent=d.limit;status.textContent=selected.map(i=>names[i]).join(' and ')+' selected.'}
 function choose(i){if(pending===null){pending=i;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));line.setAttribute('visibility','hidden');buttons[i].classList.add('start-node');status.textContent=names[i]+' selected. Choose another field.'}else if(pending===i){resetPending();status.textContent='Selection cancelled. Choose two different fields.'}else showPair(pending,i)}
 function local(e){const r=map.getBoundingClientRect();return [(e.clientX-r.left)/r.width*500,(e.clientY-r.top)/r.height*400]}
 buttons.forEach((button,i)=>{
  button.addEventListener('click',()=>{if(!suppressClick)choose(i)});
  button.addEventListener('pointerdown',e=>{if(e.button!==0)return;suppressClick=false;drag={id:e.pointerId,from:i,start:[e.clientX,e.clientY],moved:false};button.setPointerCapture(e.pointerId)});
  button.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;if(Math.hypot(e.clientX-drag.start[0],e.clientY-drag.start[1])>5)drag.moved=true;if(drag.moved){preview.setAttribute('visibility','visible');draw(preview,coords[i],local(e))}});
  button.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;preview.setAttribute('visibility','hidden');if(button.hasPointerCapture(e.pointerId))button.releasePointerCapture(e.pointerId);if(!moved)return;suppressClick=true;setTimeout(()=>suppressClick=false,0);const target=buttons.findIndex(b=>{const r=b.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom});if(target>=0&&target!==i)showPair(i,target);else{resetPending();status.textContent='Drop on a different field to connect it.'}});
  button.addEventListener('pointercancel',()=>{drag=null;suppressClick=false;resetPending()});
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){drag=null;resetPending();status.textContent='Selection cancelled.'}});showPair(0,1);
}

// Decorative, continuously moving network. No task or controls to learn.
const canvas=document.getElementById('network-canvas');
if(canvas){
 const ctx=canvas.getContext('2d'),motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const nodes=Array.from({length:52},(_,i)=>{const phase=i*2.399963,r=35+Math.sqrt(i/51)*155;return {phase,r,x:250+Math.cos(phase)*r,y:250+Math.sin(phase)*r,vx:0,vy:0,size:2.5+(i%5)*.7,hue:[174,195,216,267,316,348,35][i%7]}});
 let pointer=null,frame=null,visible=true,last=0,time=0;
 function resize(){const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=500*dpr;canvas.height=500*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
 function draw(){
  ctx.clearRect(0,0,500,500);
  for(const [x,y,hue] of [[185,210,183],[315,270,310],[245,330,35]]){const g=ctx.createRadialGradient(x,y,0,x,y,170);g.addColorStop(0,`hsla(${hue},80%,72%,.13)`);g.addColorStop(1,`hsla(${hue},80%,72%,0)`);ctx.fillStyle=g;ctx.fillRect(0,0,500,500)}
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d>102)continue;const g=ctx.createLinearGradient(a.x,a.y,b.x+.001,b.y);g.addColorStop(0,`hsla(${a.hue},65%,50%,${(1-d/102)*.65})`);g.addColorStop(1,`hsla(${b.hue},65%,50%,${(1-d/102)*.65})`);ctx.strokeStyle=g;ctx.lineWidth=.7+(1-d/102)*.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
  nodes.forEach((n,i)=>{const radius=n.size*(1+.13*Math.sin(time*1.4+i));const halo=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,radius*4);halo.addColorStop(0,`hsla(${n.hue},85%,58%,.22)`);halo.addColorStop(1,`hsla(${n.hue},85%,58%,0)`);ctx.fillStyle=halo;ctx.beginPath();ctx.arc(n.x,n.y,radius*4,0,Math.PI*2);ctx.fill();ctx.fillStyle=`hsl(${n.hue},65%,53%)`;ctx.beginPath();ctx.arc(n.x,n.y,radius,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.arc(n.x-radius*.23,n.y-radius*.25,radius*.28,0,Math.PI*2);ctx.fill()});
 }
 function tick(now){frame=null;if(!visible||document.hidden||motion.matches){last=0;return}const dt=Math.min((now-(last||now))/1000,.035);last=now;time+=dt;const step=dt*60;
  nodes.forEach((n,i)=>{const angle=n.phase+time*(.12+(i%4)*.018),r=n.r*(1+.12*Math.sin(time*.65+n.phase));const targetX=250+Math.cos(angle)*r+Math.sin(time*.8+i)*13,targetY=250+Math.sin(angle*.93)*r*.92+Math.cos(time*.6+i)*16;n.vx+=(targetX-n.x)*.003*step;n.vy+=(targetY-n.y)*.003*step;
   if(pointer){const dx=n.x-pointer.x,dy=n.y-pointer.y,d=Math.max(1,Math.hypot(dx,dy));if(d<110){const force=(1-d/110)*.6*step;n.vx+=dx/d*force;n.vy+=dy/d*force}}
   n.vx*=Math.pow(.93,step);n.vy*=Math.pow(.93,step);n.x=Math.max(20,Math.min(480,n.x+n.vx*step));n.y=Math.max(20,Math.min(480,n.y+n.vy*step));
  });draw();frame=requestAnimationFrame(tick)
 }
 function sync(){if(frame!==null){cancelAnimationFrame(frame);frame=null}last=0;if(visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(tick);else draw()}
 canvas.addEventListener('pointermove',e=>{const box=canvas.getBoundingClientRect();pointer={x:(e.clientX-box.left)/box.width*500,y:(e.clientY-box.top)/box.height*500}});
 canvas.addEventListener('pointerleave',()=>pointer=null);canvas.addEventListener('pointercancel',()=>pointer=null);canvas.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')pointer=null});
 motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('resize',resize);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(canvas);
 resize();sync();
}

const feeds=[
 {list:'post-list',status:'feed-status',file:'posts.json',origin:'https://predictivemind.substack.com'},
 {list:'personal-post-list',status:'personal-feed-status',file:'personal-posts.json',origin:'https://indigonewark.substack.com'}
];
for(const feed of feeds){
 const postList=document.getElementById(feed.list);
 if(!postList||location.protocol==='file:')continue;
 async function refreshPosts(){
  try{const response=await fetch(feed.file,{cache:'no-cache'});if(!response.ok)throw new Error('Feed unavailable');const data=await response.json();if(!Array.isArray(data.posts))throw new Error('Invalid feed');const entries=data.posts.filter(p=>{try{return typeof p.title==='string'&&new URL(p.url).origin===feed.origin&&Number.isFinite(new Date(p.date).getTime())}catch{return false}}).slice(0,20);
   if(!entries.length){if(feed.list==='personal-post-list'){const empty=document.createElement('p');empty.className='empty-posts';empty.textContent='No posts yet.';postList.replaceChildren(empty)}document.getElementById(feed.status).textContent='';return}
   const fragment=document.createDocumentFragment();for(const post of entries){const article=document.createElement('article');article.className='post-preview';const meta=document.createElement('p');meta.className='quiet-label';meta.textContent=new Date(post.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});const title=document.createElement('h2'),link=document.createElement('a');link.href=post.url;link.textContent=post.title;title.append(link);const description=document.createElement('p');description.textContent=String(post.description||'');const read=document.createElement('a');read.className='textlink';read.href=post.url;read.textContent='Read on Substack';article.append(meta,title,description,read);fragment.append(article)}postList.replaceChildren(fragment);document.getElementById(feed.status).textContent='';
  }catch{document.getElementById(feed.status).textContent=feed.list==='post-list'?'Showing saved previews. You can find all posts on Substack.':''}
 }
 refreshPosts();setInterval(()=>{if(!document.hidden)refreshPosts()},300000);
}
