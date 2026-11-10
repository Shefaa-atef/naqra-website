const phrases=['سُبْحَانَ اللَّهِ','الْحَمْدُ لِلَّهِ','اللَّهُ أَكْبَرُ'];
const labels=['Subhan Allah','Alhamdulillah','Allahu Akbar'];
const counts=[0,0,0];let active=0,arabic=false;
const orbit=document.querySelector('#beads');
for(let i=0;i<33;i++){const bead=document.createElement('span');bead.className='bead';const angle=Math.PI/2+.16+(i/32)*(Math.PI*2-.32);bead.style.setProperty('--x',`${Math.cos(angle)*50}%`);bead.style.setProperty('--y',`${Math.sin(angle)*50}%`);orbit.append(bead);}
function render(){const n=counts[active];document.querySelector('#number').textContent=String(n);document.querySelector('#phrase').textContent=phrases[active];document.querySelector('#count').setAttribute('aria-label',`${arabic?'عدّ':'Count'} ${arabic?['سبحان الله','الحمد لله','الله أكبر'][active]:labels[active]}: ${n}`);document.querySelectorAll('.bead').forEach((b,i)=>b.classList.toggle('filled',i<(n===0?0:(n-1)%33+1)));document.querySelectorAll('[data-phrase]').forEach((b,i)=>{b.classList.toggle('selected',i===active);b.setAttribute('aria-pressed',String(i===active));});}
function countOnce(manual=false){counts[active]++;render();const object=document.querySelector('.hero-object');object.classList.remove('is-clicking');void object.offsetWidth;object.classList.add('is-clicking');if(!motion.matches)playfulCount();if(manual)document.querySelector('#demo-status').textContent=`${phrases[active]} ${counts[active]}`;}
document.querySelector('#count').addEventListener('click',()=>{lastInteraction=Date.now();countOnce(true);});
document.querySelectorAll('[data-phrase]').forEach(b=>b.addEventListener('click',()=>{active=Number(b.dataset.phrase);render();}));
document.querySelector('#language').addEventListener('click',()=>{arabic=!arabic;document.documentElement.lang=arabic?'ar':'en';document.documentElement.dir=arabic?'rtl':'ltr';document.querySelectorAll('[data-en]').forEach(el=>{el.innerHTML=el.dataset[arabic?'ar':'en'];});const button=document.querySelector('#language');button.textContent=arabic?'English':'العربية';button.setAttribute('aria-label',arabic?'Switch to English':'Switch to Arabic');render();});
// Fast illustrative loop: yellow, orange, red, then green at prayer time.
const prayerScene=document.querySelector('.prayer-story'),prayerClock=document.querySelector('#prayer-time');
const prayerStar=prayerScene.querySelector('.prayer-proximity-star');
function updatePrayerStarSky(){const hour=new Date().getHours();prayerStar.dataset.sky=hour<6||hour>=19?'night':'day';}
updatePrayerStarSky();setInterval(updatePrayerStarSky,60000);
const countdownSeconds=30,greenHoldSeconds=4,prayerLoopSeconds=countdownSeconds+greenHoldSeconds;
let prayerPreviewVisible=false;
new IntersectionObserver(entries=>{prayerPreviewVisible=entries[0].isIntersecting;},{threshold:.05}).observe(prayerScene);
let demoElapsed=0,demoLast=performance.now(),lastPrayerSecond=-1,lastPrayerClockUpdate=-Infinity;
function prayerPreviewFrame(now){
 if(!document.hidden&&prayerPreviewVisible)demoElapsed=(demoElapsed+Math.min(100,now-demoLast)/1000)%prayerLoopSeconds;
 demoLast=now;
 if(document.hidden||!prayerPreviewVisible){requestAnimationFrame(prayerPreviewFrame);return;}
 const arrived=demoElapsed>=countdownSeconds,remaining=arrived?0:3600*(1-demoElapsed/countdownSeconds),seconds=Math.ceil(remaining);
 const proximity=arrived?'later':remaining<=600?'near':remaining<=2340?'soon':'hour';
 const phaseChanged=prayerScene.dataset.proximity!==proximity;
 prayerScene.dataset.proximity=proximity;
 const progress=1-remaining/3600;
 prayerScene.style.setProperty('--sun-y',(25+progress*260)+'px');
 prayerScene.style.setProperty('--sun-x',(-45+progress*90)+'px');
 prayerScene.style.setProperty('--sun-opacity',String(Math.min(1,remaining/120)));
 if(seconds!==lastPrayerSecond&&(now-lastPrayerClockUpdate>=700||seconds===0||lastPrayerSecond===0||phaseChanged)){lastPrayerClockUpdate=now;lastPrayerSecond=seconds;prayerClock.textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');}
 requestAnimationFrame(prayerPreviewFrame);
}
requestAnimationFrame(prayerPreviewFrame);

render();

// Local SVG icons share one deliberate stroke system; no remote font or emoji.
const iconPaths={windows:'<path d="M3 5l8-1v8H3zm10-1l8-1v9h-8zM3 14h8v8l-8-1zm10 0h8v9l-8-1z" fill="currentColor" stroke="none"/>',sparkles:'<path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3zM21 2v4m-2-2h4"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',shield:'<path d="M12 3 3 7v5c0 5 9 10 9 10s9-5 9-10V7z"/><path d="m8 12 3 3 5-6"/>',quote:'<path d="M10 5H3v8h5c0 3-2 4-4 5m17-13h-7v8h5c0 3-2 4-4 5"/>', 'volume-off':'<path d="m11 5-6 4H2v6h3l6 4zM16 9l6 6m0-6-6 6"/>',pause:'<path d="M8 5v14M16 5v14"/>',play:'<path d="m7 4 14 8-14 8z"/>','arrow-up-right':'<path d="M6 18 18 6M6 6h12v12"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'};
Object.assign(iconPaths,{
  bookmark:'<path d="M6 3h12v19l-6-4-6 4z"/>',
  'bookmark-filled':'<path d="M6 3h12v19l-6-4-6 4z" fill="currentColor"/>',
  volume:'<path d="m11 5-6 4H2v6h3l6 4zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  message:'<path d="M5 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2Z"/><path d="M7 8h10M7 12h7"/>',
  layers:'<path d="m12 3 10 6-10 6L2 9zM2 13l10 6 10-6M2 17l10 6 10-6"/>',
  sliders:'<path d="M4 6h7m4 0h5M4 12h2m4 0h10M4 18h10m4 0h2"/><circle cx="13" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  'chevron-up':'<path d="m6 15 6-6 6 6"/>'
});
function paintIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[el.dataset.icon]||iconPaths.sparkles}</svg>`;});}
paintIcons();
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let playing=!motion.matches,lastInteraction=0;

function updatePlay(){document.querySelector('.hero-object').classList.toggle('demo-paused',!playing);if(!playing)document.querySelector('.hero-object').classList.remove('pointer-approach');}

document.querySelector('#language').addEventListener('click',()=>{paintIcons();updatePlay();});
motion.addEventListener('change',()=>{playing=!motion.matches;updatePlay();});
const heroObject=document.querySelector('.hero-object');heroObject.setAttribute('aria-label','Interactive dhikr demonstration');document.querySelector('#language').addEventListener('click',()=>heroObject.setAttribute('aria-label',arabic?'تجربة عدّ الذكر':'Interactive dhikr demonstration'));let demoVisible=true;
new IntersectionObserver(entries=>{demoVisible=entries[0].isIntersecting;}).observe(heroObject);
setInterval(()=>{if(!playing||document.hidden||!demoVisible||Date.now()-lastInteraction<5500)return;heroObject.classList.add('pointer-approach');setTimeout(()=>{heroObject.classList.remove('pointer-approach');if(!playing||document.hidden||!demoVisible||Date.now()-lastInteraction<5500)return;countOnce();},650);},2800);
document.querySelectorAll('[data-phrase]').forEach(b=>b.addEventListener('click',()=>{lastInteraction=Date.now();}));
updatePlay();
const revealTargets=document.querySelectorAll('.section-intro,.experience-grid article,.quote-layout>*,.intention>*,.answers-section>*,.get-panel');
if('IntersectionObserver' in window){const reveals=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('in-view');reveals.unobserve(e.target);}},{threshold:.12});revealTargets.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${i%2*100}ms`);reveals.observe(el);});}
let scrollPending=false;function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-track i').style.transform=`scaleX(${max>0?scrollY/max:0})`;document.body.classList.toggle('scrolled',scrollY>40);scrollPending=false;}addEventListener('scroll',()=>{if(!scrollPending){requestAnimationFrame(updateScroll);scrollPending=true;}},{passive:true});updateScroll();

// Prayer beads share one material across the page.
document.querySelectorAll('[data-bead-loop]').forEach(loop=>{const n=Number(loop.dataset.beadLoop);for(let i=0;i<n;i++){const bead=document.createElement('i');bead.className='strand-bead';const angle=-Math.PI/2+i/n*Math.PI*2;bead.style.setProperty('--bx',`${Math.cos(angle)*48}%`);bead.style.setProperty('--by',`${Math.sin(angle)*48}%`);bead.style.setProperty('--delay',`${-2.7+i/n*2.7}s`);loop.append(bead);}});
document.querySelectorAll('[data-bead-line]').forEach(line=>{for(let i=0;i<Number(line.dataset.beadLine);i++){const bead=document.createElement('i');bead.style.setProperty('--delay',`${i*.18}s`);line.append(bead);}});
const menu=document.querySelector('#site-menu'),menuToggle=document.querySelector('#menu-toggle');
function closeMenu(){menu.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label',arabic?'فتح القائمة':'Open menu');menuToggle.querySelector('[data-icon]').dataset.icon='menu';paintIcons(menuToggle);}
menuToggle.addEventListener('click',()=>{const open=!menu.classList.contains('menu-open');menu.classList.toggle('menu-open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',arabic?(open?'إغلاق القائمة':'فتح القائمة'):(open?'Close menu':'Open menu'));menuToggle.querySelector('[data-icon]').dataset.icon=open?'close':'menu';paintIcons(menuToggle);});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.composedPath().includes(menu))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('menu-open')){closeMenu();menuToggle.focus();}});
const navLinks=menu.querySelectorAll('.menu-links a');
// Select one destination in document order, using layout coordinates, not reveal transforms.
function sectionTop(element){return element.getBoundingClientRect().top+scrollY+(element.id==='main'?0:parseFloat(getComputedStyle(element).paddingTop)||0);}
const navSections=[...navLinks].map(link=>({link,section:document.querySelector(link.hash)})).filter(item=>item.section);
function updateNavLocation(){let current=navSections[0];for(const item of navSections){if(sectionTop(item.section)<=scrollY+145)current=item;}if(innerHeight+scrollY>=document.documentElement.scrollHeight-8)current=navSections.at(-1);navSections.forEach(item=>{if(scrollY>100&&item===current)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current');});}
addEventListener('scroll',updateNavLocation,{passive:true});updateNavLocation();
document.querySelector('#language').addEventListener('click',closeMenu);
document.querySelector('#year').textContent=String(new Date().getFullYear());
const loadingStarted=performance.now();const loaded=new Promise(resolve=>{if(document.readyState==='complete')resolve();else addEventListener('load',resolve,{once:true});});
Promise.race([Promise.all([loaded,document.fonts.ready]),new Promise(resolve=>setTimeout(resolve,1800))]).then(()=>{setTimeout(()=>document.documentElement.classList.remove('is-loading'),motion.matches?0:Math.max(0,950-(performance.now()-loadingStarted)));});

// Tactile motion follows the count: a spring at the centre, then a wave on the strand.
const beadSprings=new WeakMap();
function spring(element,keyframes,options){beadSprings.get(element)?.cancel();const animation=element.animate(keyframes,options);beadSprings.set(element,animation);return animation;}
function playfulCount(){
  const button=document.querySelector('#count');
  spring(button,[{transform:'scale(1) rotate(0deg)'},{transform:'scale(.93) rotate(-1.5deg)',offset:.18},{transform:'scale(1.045) rotate(.7deg)',offset:.48},{transform:'scale(.99)',offset:.75},{transform:'scale(1) rotate(0deg)'}],{duration:700,easing:'cubic-bezier(.22,.7,.25,1)'});
  const current=(counts[active]-1)%33;
  document.querySelectorAll('#beads .bead').forEach((bead,i)=>{const angle=Math.PI/2+.16+(i/32)*(Math.PI*2-.32);const distance=Math.min((i-current+33)%33,(current-i+33)%33);
    spring(bead,[{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.2)',filter:'brightness(1.3)',offset:.3},{transform:'translate(-50%,-50%) scale(.92)',offset:.65},{transform:'translate(-50%,-50%) scale(1)'}],{duration:650,delay:distance*22,easing:'cubic-bezier(.2,.8,.2,1)'});
  });
  spring(document.querySelector('#pendant-swing'),[{transform:'rotate(0deg)'},{transform:'rotate(-9deg)',offset:.2},{transform:'rotate(6deg)',offset:.45},{transform:'rotate(-3deg)',offset:.7},{transform:'rotate(0deg)'}],{duration:1200,easing:'ease-out'});
  const ripple=document.createElement('span');ripple.className='click-ripple';ripple.setAttribute('aria-hidden','true');heroObject.append(ripple);const rippleMotion=ripple.animate([{opacity:0,scale:.9},{opacity:.65,scale:1,offset:.15},{opacity:0,scale:1.4}],{duration:1000,easing:'ease-out'});rippleMotion.onfinish=()=>ripple.remove();
  if(counts[active]%33===0)spring(document.querySelector('.ring-one'),[{boxShadow:'0 0 0 0 #e5dfaa00'},{boxShadow:'0 0 70px 12px #e5dfaa30',offset:.4},{boxShadow:'0 0 0 0 #e5dfaa00'}],{duration:1400,easing:'ease-out'});
}
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
heroObject.addEventListener('pointermove',event=>{if(motion.matches||!finePointer.matches)return;const r=heroObject.getBoundingClientRect();heroObject.style.setProperty('--light-x',`${(event.clientX-r.left)/r.width*100}%`);heroObject.style.setProperty('--light-y',`${(event.clientY-r.top)/r.height*100}%`);heroObject.classList.add('light-follow');});
heroObject.addEventListener('pointerleave',()=>heroObject.classList.remove('light-follow'));
document.querySelectorAll('.hero .button,.get-button').forEach(button=>{button.addEventListener('pointermove',event=>{if(motion.matches||!finePointer.matches)return;const r=button.getBoundingClientRect();button.style.setProperty('--mag-x',`${(event.clientX-r.left-r.width/2)*.035}px`);button.style.setProperty('--mag-y',`${(event.clientY-r.top-r.height/2)*.1}px`);});button.addEventListener('pointerleave',()=>{button.style.setProperty('--mag-x','0px');button.style.setProperty('--mag-y','0px');});});
// Keep the Arabic wordmark upright; only the Latin letters spring into place.
const footerName=document.querySelector('.footer-name');footerName.setAttribute('aria-hidden','true');footerName.innerHTML=[...'Naqra.'].map((letter,i)=>`<span class="footer-letter${i===5?' footer-period':''}">${letter}</span>`).join('');
const footerLetters=[...footerName.children];let footerEntered=false;
function footerBounce(){if(motion.matches)return;footerLetters.forEach((letter,i)=>spring(letter,[{transform:'translateY(0)'},{transform:'translateY(-15px) rotate(-4deg)',offset:.4},{transform:'translateY(0) rotate(0deg)'}],{duration:600,delay:i*35,easing:'cubic-bezier(.2,.8,.2,1)'}));}
if(!motion.matches){footerLetters.forEach(letter=>letter.style.opacity='0');const footerEntrance=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;footerEntered=true;footerLetters.forEach((letter,i)=>{letter.style.opacity='1';spring(letter,[{opacity:0,transform:'translateY(65px) rotate(10deg) scale(.85)'},{opacity:1,transform:'translateY(-12px) rotate(-3deg) scale(1.03)',offset:.65},{opacity:1,transform:'translateY(0) rotate(0deg) scale(1)'}],{duration:850,delay:i*65,easing:'cubic-bezier(.2,.7,.2,1)'});});footerEntrance.disconnect();},{threshold:.3});footerEntrance.observe(footerName);}
document.querySelector('.footer-brand').addEventListener('pointerenter',()=>{if(footerEntered)footerBounce();});
motion.addEventListener('change',()=>{if(motion.matches){document.querySelectorAll('#beads .bead,#count,#pendant-swing,.footer-letter').forEach(el=>{beadSprings.get(el)?.cancel();});footerLetters.forEach(letter=>letter.style.opacity='1');document.querySelectorAll('.click-ripple').forEach(el=>el.remove());heroObject.classList.remove('light-follow');}});

// Interactive website previews use local sample state only.
let shortcutDemoCount=13,shortcutExpiry;
const shortcutToast=document.querySelector('#shortcut-toast'),shortcutTrigger=document.querySelector('#shortcut-trigger');
shortcutTrigger.setAttribute('aria-keyshortcuts','F8');
document.addEventListener('keydown',e=>{
  if(e.key!=='F8'||e.ctrlKey||e.altKey||e.shiftKey||e.metaKey||e.isComposing||e.defaultPrevented)return;
  if(e.target instanceof Element&&e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]'))return;
  e.preventDefault();
  if(!e.repeat)shortcutTrigger.click();
});
shortcutTrigger.addEventListener('click',()=>{
  clearTimeout(shortcutExpiry);
  shortcutDemoCount++;
  document.querySelector('#shortcut-total').textContent=String(shortcutDemoCount);
  shortcutToast.classList.remove('toast-resting');
  if(!motion.matches){
    spring(shortcutToast,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.7,.3,1)'});
    spring(shortcutTrigger.querySelector('kbd'),[{transform:'translateY(0)',boxShadow:'0 5px 0 #071e26'},{transform:'translateY(4px)',boxShadow:'0 1px 0 #071e26',offset:.35},{transform:'translateY(0)',boxShadow:'0 5px 0 #071e26'}],{duration:240,easing:'ease-out'});
    spring(shortcutToast.querySelector('.shortcut-medal'),[{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});
  }
  shortcutExpiry=setTimeout(()=>shortcutToast.classList.add('toast-resting'),1700);
});
let prayerDemoMuted=true,verseBookmarked=false;
const prayerMute=document.querySelector('#prayer-demo-mute'),bookmark=document.querySelector('#verse-bookmark');
function renderWidgetLabels(){const status=document.querySelector('#prayer-demo-status');const label=prayerDemoMuted?(arabic?'تذكير صامت':'Silent reminder'):(arabic?'معاينة إعداد الصوت':'Sound setting preview');status.textContent=label;status.dataset.en=prayerDemoMuted?'Silent reminder':'Sound setting preview';status.dataset.ar=prayerDemoMuted?'تذكير صامت':'معاينة إعداد الصوت';prayerMute.setAttribute('aria-label',arabic?'كتم الصوت في المعاينة':'Mute sound setting in preview');bookmark.setAttribute('aria-label',arabic?(verseBookmarked?'إلغاء الحفظ في المثال':'حفظ النص في المثال'):(verseBookmarked?'Remove demo bookmark':'Bookmark this reminder in the demo'));document.querySelector('#verse-saved').textContent=verseBookmarked?(arabic?'محفوظة في المثال':'Saved in demo'):'';}
prayerMute.addEventListener('click',()=>{prayerDemoMuted=!prayerDemoMuted;prayerMute.setAttribute('aria-pressed',String(prayerDemoMuted));prayerMute.querySelector('[data-icon]').dataset.icon=prayerDemoMuted?'volume-off':'volume';paintIcons(prayerMute);renderWidgetLabels();});
bookmark.addEventListener('click',()=>{verseBookmarked=!verseBookmarked;bookmark.setAttribute('aria-pressed',String(verseBookmarked));bookmark.querySelector('[data-icon]').dataset.icon=verseBookmarked?'bookmark-filled':'bookmark';paintIcons(bookmark);document.querySelector('.verse-card').classList.toggle('is-bookmarked',verseBookmarked);if(!motion.matches)spring(bookmark,[{transform:'scale(1)'},{transform:'scale(1.22) rotate(-8deg)',offset:.4},{transform:'scale(1) rotate(0deg)'}],{duration:400});renderWidgetLabels();});
const weekSamples=[12,23,18,34,27,42,33],weekNames=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],weekArabic=['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'];let selectedSample=6;
const weekChart=document.querySelector('#week-chart');weekSamples.forEach((value,i)=>{const button=document.createElement('button');button.className='week-bar';button.style.setProperty('--bar-height',`${value/50*100}%`);button.innerHTML=`<span class="week-bar-track"><i></i></span><span class="week-bar-label"></span>`;button.addEventListener('click',()=>{selectedSample=i;renderWeek();if(!motion.matches)spring(document.querySelector('#week-count'),[{opacity:.3,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});});weekChart.append(button);});
function renderWeek(){weekChart.setAttribute('aria-label',arabic?'استكشف النشاط اليومي التجريبي':'Explore daily activity');beadSprings.get(document.querySelector('#week-ring-value'))?.cancel();const value=weekSamples[selectedSample],percent=Math.round(value/50*100);document.querySelector('#week-count').textContent=String(value);document.querySelector('#week-day').textContent=(arabic?weekArabic:weekNames)[selectedSample];document.querySelector('#week-percent').textContent=percent+'%';document.querySelector('#week-ring-value').style.strokeDashoffset=String(251.33*(1-value/50));weekChart.querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===selectedSample));button.setAttribute('aria-label',`${(arabic?weekArabic:weekNames)[i]}: ${weekSamples[i]}`);button.querySelector('.week-bar-label').textContent=arabic?['ن','ث','ر','خ','ج','س','ح'][i]:['M','T','W','T','F','S','S'][i];});}
renderWeek();renderWidgetLabels();document.querySelector('#language').addEventListener('click',()=>{renderWeek();renderWidgetLabels();});

const beadCord=document.createElementNS('http://www.w3.org/2000/svg','svg');beadCord.setAttribute('viewBox','0 0 100 100');beadCord.setAttribute('class','masbaha-cord');beadCord.setAttribute('aria-hidden','true');
const cordPath=document.createElementNS('http://www.w3.org/2000/svg','path');const start=Math.PI/2+.16,end=Math.PI/2+Math.PI*2-.16;const point=a=>`${50+Math.cos(a)*50} ${50+Math.sin(a)*50}`;cordPath.setAttribute('d',`M ${point(start)} A 50 50 0 1 1 ${point(end)}`);beadCord.append(cordPath);orbit.prepend(beadCord);
// Motion is attached to the control that caused it, with no page-layout shifts.
document.querySelectorAll('.answers-list details').forEach(detail=>detail.addEventListener('toggle',()=>{if(motion.matches||!detail.open)return;spring(detail.querySelector('.answer-dot'),[{transform:'scale(.8) rotate(-12deg)'},{transform:'scale(1.12) rotate(5deg)',offset:.55},{transform:'scale(1) rotate(0deg)'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});spring(detail.querySelector('.answer-body'),[{opacity:.2,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'ease-out'});}));
document.querySelectorAll('.answers-list summary,.salah-mute,.verse-bookmark,.get-button,.menu-toggle').forEach(control=>control.addEventListener('pointerdown',event=>{if(motion.matches)return;const bounds=control.getBoundingClientRect(),ripple=document.createElement('span'),zoom=control.currentCSSZoom||1,size=Math.max(bounds.width,bounds.height)*2/zoom;ripple.className='control-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.cssText=`width:${size}px;height:${size}px;left:${(event.clientX-bounds.left)/zoom}px;top:${(event.clientY-bounds.top)/zoom}px`;control.append(ripple);const animation=ripple.animate([{scale:0,opacity:.8},{scale:1,opacity:0}],{duration:650,easing:'ease-out'});animation.onfinish=()=>ripple.remove();}));
let clockVisible=false;
const clockVisibility=new IntersectionObserver(entries=>{clockVisible=entries[0].isIntersecting;},{threshold:.1});clockVisibility.observe(document.querySelector('.salah-clock'));

const ringEntrance=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;if(!motion.matches){const ring=document.querySelector('#week-ring-value');spring(ring,[{strokeDashoffset:'251.33'},{strokeDashoffset:ring.style.strokeDashoffset}],{duration:1100,easing:'cubic-bezier(.2,.8,.2,1)'});}ringEntrance.disconnect();},{threshold:.35});ringEntrance.observe(document.querySelector('.week-widget'));
motion.addEventListener('change',()=>{if(!motion.matches)return;document.querySelectorAll('.answer-dot,.answer-body,#prayer-time,#week-ring-value').forEach(el=>beadSprings.get(el)?.cancel());document.querySelectorAll('.control-ripple').forEach(el=>el.remove());});
// The chart pointer demonstrates the same selectable days as a real tap.
const weekWidget=document.querySelector('.week-widget');
const weekPointer=document.createElement('span');weekPointer.className='week-demo-pointer';weekPointer.setAttribute('aria-hidden','true');weekPointer.innerHTML='<svg viewBox="0 0 32 40" fill="none"><path d="M4 3L27 23L17 24L12 35L4 3Z" fill="#fff7df" stroke="#123e42" stroke-width="2" stroke-linejoin="round"/></svg>';weekChart.append(weekPointer);
let weekPlaying=!motion.matches,weekVisible=false,weekTimer,weekTouchTimer,weekRevision=0;
function stopWeekStep(){clearTimeout(weekTimer);clearTimeout(weekTouchTimer);weekRevision++;}
function renderWeekPlay(){weekWidget.classList.toggle('week-demo-running',weekPlaying&&weekVisible&&!motion.matches);}
function scheduleWeekStep(delay=2200){stopWeekStep();if(!weekPlaying||!weekVisible||motion.matches||document.hidden)return;const revision=weekRevision;weekTimer=setTimeout(()=>{if(revision!==weekRevision)return;const next=(selectedSample+1)%weekSamples.length,bar=weekChart.querySelectorAll('.week-bar')[next],fill=bar.querySelector('i').getBoundingClientRect(),chart=weekChart.getBoundingClientRect();weekWidget.classList.remove('week-demo-resting');weekPointer.style.left=`${(fill.left+fill.width/2-chart.left-3)/chart.width*100}%`;weekPointer.style.top=`${(fill.top+Math.min(12,fill.height/3)-chart.top-2)/chart.height*100}%`;weekTouchTimer=setTimeout(()=>{if(revision!==weekRevision||!weekPlaying||!weekVisible||motion.matches||document.hidden)return;weekPointer.classList.remove('is-touching');void weekPointer.offsetWidth;weekPointer.classList.add('is-touching');spring(weekPointer.querySelector('svg'),[{transform:'scale(1)'},{transform:'scale(.78)',offset:.35},{transform:'scale(1)'}],{duration:350,easing:'ease-out'});bar.click();scheduleWeekStep(2500);},700);},delay);}
function pauseForWeekInput(){stopWeekStep();weekWidget.classList.add('week-demo-resting');if(weekPlaying&&weekVisible&&!motion.matches)scheduleWeekStep(6000);}
weekChart.addEventListener('pointerdown',pauseForWeekInput);weekChart.addEventListener('keydown',pauseForWeekInput);

new IntersectionObserver(entries=>{weekVisible=entries[0].isIntersecting;renderWeekPlay();if(weekVisible)scheduleWeekStep(1100);else stopWeekStep();},{threshold:.4}).observe(weekWidget);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopWeekStep();else scheduleWeekStep(1100);});
motion.addEventListener('change',()=>{weekPlaying=!motion.matches;renderWeekPlay();if(weekPlaying)scheduleWeekStep(1100);else stopWeekStep();});
document.querySelector('#language').addEventListener('click',()=>{renderWeekPlay();if(weekPlaying)scheduleWeekStep(1000);});renderWeekPlay();
// Light and a small tilt follow the pointer only on the feature preview cards.
document.querySelectorAll('.experience-grid article').forEach(card=>{let hoverFrame=0;card.addEventListener('pointermove',event=>{if(motion.matches||!finePointer.matches)return;if(hoverFrame)cancelAnimationFrame(hoverFrame);hoverFrame=requestAnimationFrame(()=>{const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;card.style.setProperty('--hover-rx',`${(y-.5)*-4}deg`);card.style.setProperty('--hover-ry',`${(x-.5)*5}deg`);card.querySelector('.story-visual').style.setProperty('--hover-light-x',`${x*100}%`);card.querySelector('.story-visual').style.setProperty('--hover-light-y',`${y*100}%`);});});card.addEventListener('pointerleave',()=>{cancelAnimationFrame(hoverFrame);card.style.setProperty('--hover-rx','0deg');card.style.setProperty('--hover-ry','0deg');});});

// Reveal whole words so Arabic shaping and the original reading order stay intact.
const textObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('text-entered');textObserver.unobserve(entry.target);}});
},{threshold:.25});
function prepareTextMotion(){
  document.querySelectorAll('h1[data-en],h2[data-en],h3[data-en]').forEach(heading=>{
    textObserver.unobserve(heading);
    heading.classList.remove('text-entered');
    heading.classList.add('word-reveal');
    let index=0;
    const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const fragment=document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word=>{
        if(!word)return;
        if(/\s/.test(word)){fragment.append(document.createTextNode(word));return;}
        const span=document.createElement('span');span.className='motion-word';span.textContent=word;span.style.setProperty('--word-delay',`${Math.min(index++*65,520)}ms`);fragment.append(span);
      });node.replaceWith(fragment);
    });
    textObserver.observe(heading);
  });
}
prepareTextMotion();
document.querySelector('#language').addEventListener('click',prepareTextMotion);

// Both ends and the bottom knot share the very same cord and stroke.
function connectMasbaha(){
  const pendant=document.querySelector('.tassel');
  const knotY=(parseFloat(getComputedStyle(pendant).top)+parseFloat(getComputedStyle(pendant).height)*13/80-orbit.offsetTop)/orbit.clientHeight*100;
  cordPath.setAttribute('d',`M ${point(start)} A 50 50 0 1 1 ${point(end)} L 50 ${knotY} L ${point(start)}`);
}
new ResizeObserver(connectMasbaha).observe(heroObject);
connectMasbaha();


// Reveal the navigation when the reader reverses direction.
let navLastY=scrollY,navTravel=0,navDirection=0;
addEventListener('scroll',()=>{const y=Math.max(0,scrollY),delta=y-navLastY,direction=Math.sign(delta);if(direction!==navDirection)navTravel=0;navTravel+=Math.abs(delta);navDirection=direction;navLastY=y;const nav=document.querySelector('#site-menu');if(y<90||nav.classList.contains('menu-open'))nav.classList.remove('nav-hidden');else if(navTravel>9)nav.classList.toggle('nav-hidden',direction>0);},{passive:true});
document.querySelector('#site-menu').addEventListener('focusin',()=>document.querySelector('#site-menu').classList.remove('nav-hidden'));
// Content and attributions come from the bundled desktop library.
const reminderItems=[{"category":"quran","arabic":"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ","reference_ar":"الرعد ١٣:٢٨ · جزء من الآية","reference_en":"Ar-Ra’d 13:28 · Excerpt"},{"arabic":"بِاسْمِكَ أَمُوتُ وَأَحْيَا","category":"dua","authenticity":"Sahih · Sahih al-Bukhari","id":"dua-sleep","english":"Before sleeping · prophetic supplication","url":"https://sunnah.com/bukhari:6312","license":"Classical Arabic text, public domain; no modern translation reproduced","reference":"Sahih al-Bukhari 6312 · excerpt","reference_ar":"صحيح البخاري 6312 · صحيح","reference_en":"Sahih al-Bukhari 6312 · Sahih"},{"arabic":"إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى","category":"hadith","authenticity":"Sahih · Sahih al-Bukhari","id":"hadith-intentions","english":"On intentions · excerpt, not the complete narration","url":"https://sunnah.com/bukhari:1","license":"Classical Arabic text, public domain; no modern translation reproduced","reference":"Sahih al-Bukhari 1 · excerpt","reference_ar":"صحيح البخاري 1 · صحيح","reference_en":"Sahih al-Bukhari 1 · Sahih"}];
let reminderIndex=0,reminderVisible=false,reminderTransition=0;
const reminderAnimations=new Set();
const reminderCard=document.querySelector('.verse-card');
function renderReminder(){const item=reminderItems[reminderIndex],category=document.querySelector('#reminder-category'),reference=document.querySelector('#reminder-reference');const names={quran:['Quran','القرآن الكريم'],dua:['Du’a','دعاء'],hadith:['Hadith','حديث']};category.dataset.en=names[item.category][0];category.dataset.ar=names[item.category][1];category.textContent=names[item.category][arabic?1:0];reminderCard.querySelector('blockquote').textContent=item.arabic;reference.dataset.en=item.reference_en;reference.dataset.ar=item.reference_ar;reference.textContent=arabic?item.reference_ar:item.reference_en;reminderCard.dataset.category=item.category;}
function animateReminder(element,frames,options){const animation=element.animate(frames,options);reminderAnimations.add(animation);animation.finished.catch(()=>{}).finally(()=>reminderAnimations.delete(animation));return animation;}
async function changeReminder(){
 const revision=++reminderTransition;
 const text=reminderCard.querySelector('blockquote'),category=document.querySelector('#reminder-category'),reference=document.querySelector('#reminder-reference');
 const nodes=[text,category,reference];
 if(!motion.matches){
  const exits=nodes.map((node,i)=>animateReminder(node,[{opacity:1,transform:'translateY(0)',filter:'blur(0px)'},{opacity:0,transform:'translateY(-8px)',filter:'blur(2px)'}],{duration:130,delay:i*15,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}));
  await Promise.all(exits.map(a=>a.finished.catch(()=>{})));
  if(revision!==reminderTransition)return;
 }
 reminderIndex=(reminderIndex+1)%reminderItems.length;
 verseBookmarked=false;bookmark.setAttribute('aria-pressed','false');bookmark.querySelector('[data-icon]').dataset.icon='bookmark';reminderCard.classList.remove('is-bookmarked');paintIcons(bookmark);renderWidgetLabels();renderReminder();
 nodes.forEach(node=>node.getAnimations().forEach(animation=>animation.cancel()));
 if(!motion.matches){
  nodes.forEach((node,i)=>animateReminder(node,[{opacity:0,transform:'translateY(14px)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0px)'}],{duration:360,delay:i*45,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
 }
}
function settleReminder(){reminderTransition++;reminderAnimations.forEach(animation=>animation.cancel());reminderAnimations.clear();reminderCard.querySelectorAll('blockquote,#reminder-category,#reminder-reference').forEach(node=>node.getAnimations().forEach(animation=>animation.cancel()));renderReminder();}
new IntersectionObserver(entries=>{reminderVisible=entries[0].isIntersecting;},{threshold:.2}).observe(reminderCard);
setInterval(()=>{if(document.hidden||!reminderVisible||reminderCard.contains(document.activeElement))return;changeReminder();},4500);
document.querySelector('#language').addEventListener('click',settleReminder);motion.addEventListener('change',()=>{if(motion.matches)settleReminder();});renderReminder();



// A short easing tail for mouse wheels; touch, keyboard and reduced motion stay native.
let wheelTarget=scrollY,wheelFrame=0,wheelPrevious=0;
function stopWheel(){if(wheelFrame)cancelAnimationFrame(wheelFrame);wheelFrame=0;wheelPrevious=0;wheelTarget=scrollY;}
function easeWheel(now){const dt=wheelPrevious?Math.min(40,now-wheelPrevious):16;wheelPrevious=now;const current=scrollY,next=current+(wheelTarget-current)*(1-Math.exp(-dt/85));window.scrollTo({top:next,behavior:'instant'});if(Math.abs(wheelTarget-next)>.5)wheelFrame=requestAnimationFrame(easeWheel);else{window.scrollTo({top:wheelTarget,behavior:'instant'});wheelFrame=0;wheelPrevious=0;}}
addEventListener('wheel',event=>{if(motion.matches||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('.menu-links,textarea,input,select,[contenteditable=true]'))return;if(!event.deltaY)return;event.preventDefault();const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);wheelTarget=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,(wheelFrame?wheelTarget:scrollY)+delta));if(!wheelFrame)wheelFrame=requestAnimationFrame(easeWheel);},{passive:false});
addEventListener('touchstart',stopWheel,{passive:true});addEventListener('pointerdown',stopWheel,{passive:true});addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))stopWheel();});motion.addEventListener('change',()=>{if(motion.matches)stopWheel();});
// Let native anchors handle focus, history and scrolling exactly once.
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;stopWheel();closeMenu();});

// The pointer wears a small masbaha: pearls on a cord with a swinging tassel. It unrolls around
// controls and counts each click with a jade bead, like the demo in the hero.
// The real cursor stays native, so this layer is decoration and can never add input lag.
(()=>{
  const forcedColors=matchMedia('(forced-colors: active)');
  const enabled=()=>finePointer.matches&&!motion.matches&&!forcedColors.matches;
  const CONTROLS='a[href],button,summary,label,[role=button]',READING='p,h1,h2,h3,blockquote,figcaption';
  const SHAPES={idle:{radius:25,count:12,bead:3},hover:{radius:36,count:18,bead:3.2},text:{radius:12,count:12,bead:1.5}};
  const MAX_BEADS=56,COUNTING_BEADS=12,BEAD_SPACING=15,WRAP_BEAD=2.6,CORD_GAP=11;
  const WRAP_PADDING=10,WRAP_MAX_WIDTH=320,WRAP_MAX_HEIGHT=110;
  const SPRITE_RADIUS=5,SPRITE_PADDING=3,SPRITE_SCALE=3,PENDANT_SCALE=.25;

  let layer,canvas,ctx,pearl,jade,pendant,width=0,height=0,dpr=1;
  const beads=Array.from({length:MAX_BEADS},()=>({x:0,y:0,vx:0,vy:0,size:0,fill:0}));
  const anchor={x:0,y:0,vx:0,vy:0},swing={p:0,v:0},flow={x:0,y:0};
  let mouseX=0,mouseY=0,previousX=0,previousY=0,alpha=0,pointX=0,pointY=0;
  let target=null,hovered=null,mode='idle',pressed=false,visible=false,recheck=false,raf=0,last=0;
  let filled=0,waveAt=-1e9,waveFrom=0;

  // Pearl and jade use the same gradients as the hero's beads.
  function beadSprite(stops,shadow){
    const size=(SPRITE_RADIUS+SPRITE_PADDING)*2*SPRITE_SCALE,sprite=document.createElement('canvas');sprite.width=sprite.height=size;
    const g=sprite.getContext('2d'),mid=size/2,r=SPRITE_RADIUS*SPRITE_SCALE,x=mid-r*.4,y=mid-r*.56,fill=g.createRadialGradient(x,y,0,x,y,r*2.1);
    stops.forEach(([offset,color])=>fill.addColorStop(offset,color));
    g.shadowColor=shadow;g.shadowBlur=2*SPRITE_SCALE;g.shadowOffsetY=.6*SPRITE_SCALE;g.fillStyle=fill;g.beginPath();g.arc(mid,mid,r,0,Math.PI*2);g.fill();
    return sprite;
  }
  // The pendant is drawn from the same shapes and colours as the hero's tassel.
  function pendantSprite(){
    const sprite=document.createElement('canvas'),s=PENDANT_SCALE*SPRITE_SCALE;sprite.width=30*s;sprite.height=72*s;
    const g=sprite.getContext('2d');g.setTransform(s,0,0,s,-9*s,-8*s);
    const imam=g.createRadialGradient(22,14,0,24,22,14);imam.addColorStop(0,'#f2f3dc');imam.addColorStop(.6,'#a8c4b9');imam.addColorStop(1,'#37696d');
    const silk=g.createLinearGradient(11,0,37,0);[[0,'#29494e'],[.38,'#a5adc9'],[.55,'#d9deed'],[1,'#29494e']].forEach(([o,c])=>silk.addColorStop(o,c));
    const binding=g.createLinearGradient(18,0,30,0);[[0,'#37696d'],[.5,'#c2cfb4'],[1,'#37696d']].forEach(([o,c])=>binding.addColorStop(o,c));
    g.fillStyle=silk;g.fill(new Path2D('M24 36C18 42 7 56 11 69Q24 76 37 69C41 56 30 42 24 36Z'));
    g.fillStyle=imam;g.beginPath();g.ellipse(24,22,6,12,0,0,Math.PI*2);g.fill();
    g.fillStyle=binding;g.beginPath();g.roundRect(18,32,12,8,2.5);g.fill();
    return sprite;
  }
  function prepare(){
    if(layer)return;
    layer=document.createElement('div');layer.className='nq-cursor';layer.setAttribute('aria-hidden','true');
    canvas=document.createElement('canvas');layer.append(canvas);document.body.append(layer);ctx=canvas.getContext('2d');
    pearl=beadSprite([[0,'#fff'],[.34,'#edf1ec'],[.7,'#c1cdc9'],[1,'#8da8a4']],'#153e4366');
    jade=beadSprite([[0,'#effac7'],[.4,'#9bd9b0'],[1,'#427a61']],'#a1e5b3a0');
    pendant=pendantSprite();
  }
  function resize(){dpr=Math.min(2,devicePixelRatio||1);width=layer.clientWidth;height=layer.clientHeight;canvas.width=width*dpr;canvas.height=height*dpr;}

  // Walks a rounded rectangle clockwise from its bottom centre, so the tassel always hangs at the join.
  function perimeter(p){return 2*(p.w-2*p.r)+2*(p.h-2*p.r)+2*Math.PI*p.r;}
  function pointOn(distance,p){
    const hw=p.w/2-p.r,hh=p.h/2-p.r,arc=p.r*Math.PI/2,{x,y,r}=p;let d=distance;
    const at=(px,py)=>{pointX=px;pointY=py;};
    if(d<hw)return at(x-d,y+p.h/2);d-=hw;
    if(d<arc)return at(x-hw-Math.sin(d/r)*r,y+hh+Math.cos(d/r)*r);d-=arc;
    if(d<2*hh)return at(x-p.w/2,y+hh-d);d-=2*hh;
    if(d<arc)return at(x-hw-Math.cos(d/r)*r,y-hh-Math.sin(d/r)*r);d-=arc;
    if(d<2*hw)return at(x-hw+d,y-p.h/2);d-=2*hw;
    if(d<arc)return at(x+hw+Math.sin(d/r)*r,y-hh-Math.cos(d/r)*r);d-=arc;
    if(d<2*hh)return at(x+p.w/2,y-hh+d);d-=2*hh;
    if(d<arc)return at(x+hw+Math.cos(d/r)*r,y+hh+Math.sin(d/r)*r);d-=arc;
    return at(x+hw-d,y+p.h/2);
  }
  function aim(element){
    if(element===hovered)return;hovered=element;
    target=element?.closest?.(CONTROLS)||null;
    mode=target?'hover':element?.closest?.(READING)?'text':'idle';
  }
  function currentPath(){
    const shape=SHAPES[mode],size=shape.radius*2,round={x:mouseX,y:mouseY,w:size,h:size,r:shape.radius,count:shape.count,bead:shape.bead,mode};
    if(!target)return round;
    const box=target.isConnected?target.getBoundingClientRect():null;
    if(!box||!box.width||box.width>WRAP_MAX_WIDTH||box.height>WRAP_MAX_HEIGHT)return round;
    // Unroll around the control and lean slightly toward the pointer so it still feels attached.
    const centerX=box.left+box.width/2,centerY=box.top+box.height/2,w=box.width+WRAP_PADDING*2,h=box.height+WRAP_PADDING*2;
    const radius=getComputedStyle(target).borderTopLeftRadius,own=radius.endsWith('%')?h/2:parseFloat(radius)*(target.currentCSSZoom||1);
    const wrap={x:centerX+(mouseX-centerX)*.08,y:centerY+(mouseY-centerY)*.08,w,h,r:Math.min(Math.max(own+WRAP_PADDING,12),Math.min(w,h)/2),bead:WRAP_BEAD,mode:'wrap'};
    wrap.count=Math.min(MAX_BEADS,Math.max(10,Math.round(perimeter(wrap)/BEAD_SPACING)));
    return wrap;
  }
  function draw(visibleBeads,now){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    if(alpha<.01)return;
    ctx.globalAlpha=alpha;
    ctx.beginPath();ctx.moveTo(anchor.x,anchor.y);
    for(let i=0;i<visibleBeads;i++){const bead=beads[i],next=beads[Math.min(i+1,visibleBeads-1)];ctx.quadraticCurveTo(bead.x,bead.y,(bead.x+next.x)/2,(bead.y+next.y)/2);}
    ctx.lineTo(anchor.x,anchor.y);
    ctx.strokeStyle='#102e3459';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='#d4e2d2cc';ctx.lineWidth=.9;ctx.stroke();
    ctx.save();ctx.translate(anchor.x,anchor.y);ctx.rotate(swing.p);
    ctx.drawImage(pendant,-15*PENDANT_SCALE,-2*PENDANT_SCALE,30*PENDANT_SCALE,72*PENDANT_SCALE);ctx.restore();
    const spriteRatio=(SPRITE_RADIUS+SPRITE_PADDING)/SPRITE_RADIUS,since=now-waveAt;
    for(let i=0;i<visibleBeads;i++){
      const bead=beads[i],wave=(since-Math.abs(i-waveFrom)*22)/420,pulse=wave>0&&wave<1?Math.sin(wave*Math.PI)**2*.6:0,half=bead.size*(1+pulse)*spriteRatio;
      if(half<=.05)continue;
      ctx.globalAlpha=alpha;ctx.drawImage(pearl,bead.x-half,bead.y-half,half*2,half*2);
      if(bead.fill>.01){ctx.globalAlpha=alpha*bead.fill;ctx.drawImage(jade,bead.x-half,bead.y-half,half*2,half*2);}
    }
    ctx.globalAlpha=1;
  }
  function frame(now){
    raf=0;if(!visible)return;
    const dt=last?Math.max(.004,Math.min(.034,(now-last)/1000)):.016;last=now;
    if(recheck){recheck=false;hovered=null;aim(document.elementFromPoint(mouseX,mouseY));}
    const path=currentPath(),press=pressed?(path.mode==='wrap'?.975:.86):1;
    path.w*=press;path.h*=press;path.r*=press;

    const rawX=(mouseX-previousX)/dt,rawY=(mouseY-previousY)/dt,moved=rawX!==0||rawY!==0;previousX=mouseX;previousY=mouseY;
    const smooth=1-Math.exp(-dt*18);flow.x+=(rawX-flow.x)*smooth;flow.y+=(rawY-flow.y)*smooth;
    const flowSpeed=Math.hypot(flow.x,flow.y),length=perimeter(path),span=Math.max(0,length-CORD_GAP*2);
    const sizeEase=1-Math.exp(-dt*18),fillEase=1-Math.exp(-dt*12);
    let settled=!moved&&flowSpeed<.5,visibleBeads=0;
    beads.forEach((bead,i)=>{
      const active=i<path.count;pointOn(CORD_GAP+span*(active?i/(path.count-1):1),path);
      // Beads on the leading side respond faster, so the ring stretches into a strand as it travels.
      const offsetX=pointX-path.x,offsetY=pointY-path.y,reach=Math.hypot(offsetX,offsetY)||1;
      const lead=flowSpeed>40?(offsetX*flow.x+offsetY*flow.y)/(reach*flowSpeed)*Math.min(1,flowSpeed/900):0,stiffness=560+lead*170;
      bead.vx+=(stiffness*(pointX-bead.x)-38*bead.vx)*dt;bead.vy+=(stiffness*(pointY-bead.y)-38*bead.vy)*dt;bead.x+=bead.vx*dt;bead.y+=bead.vy*dt;
      const size=active?path.bead:0,fill=i<filled?1:0;bead.size+=(size-bead.size)*sizeEase;bead.fill+=(fill-bead.fill)*fillEase;
      if(bead.size>.2)visibleBeads=i+1;
      if(Math.abs(bead.vx)+Math.abs(bead.vy)>.6||Math.abs(pointX-bead.x)+Math.abs(pointY-bead.y)>.2||Math.abs(size-bead.size)>.02||Math.abs(fill-bead.fill)>.01)settled=false;
    });
    const anchorGoalY=path.y+path.h/2,oldVX=anchor.vx;
    anchor.vx+=(560*(path.x-anchor.x)-38*anchor.vx)*dt;anchor.vy+=(560*(anchorGoalY-anchor.y)-38*anchor.vy)*dt;anchor.x+=anchor.vx*dt;anchor.y+=anchor.vy*dt;
    swing.v+=(-90*swing.p-5*swing.v-(anchor.vx-oldVX)/dt*.0042)*dt;swing.p=Math.max(-1,Math.min(1,swing.p+swing.v*dt));
    const wantedAlpha=path.mode==='text'?0:path.mode==='idle'?.9:1;alpha+=(wantedAlpha-alpha)*(1-Math.exp(-dt*16));
    draw(visibleBeads,now);
    const waving=now-waveAt<420+path.count*22;
    if(!settled||waving||Math.abs(swing.p)+Math.abs(swing.v)>.015||Math.abs(anchor.vx)+Math.abs(anchor.vy)>.6||Math.abs(wantedAlpha-alpha)>.01)raf=requestAnimationFrame(frame);else last=0;
  }
  function wake(){if(!raf&&visible)raf=requestAnimationFrame(frame);}
  function hide(){visible=false;pressed=false;layer?.classList.remove('is-visible');if(raf)cancelAnimationFrame(raf);raf=0;last=0;}
  function show(x,y){
    prepare();resize();visible=true;layer.classList.add('is-visible');previousX=x;previousY=y;alpha=0;flow.x=flow.y=0;
    beads.forEach(bead=>{bead.x=x;bead.y=y;bead.vx=bead.vy=0;bead.size=0;});
    anchor.x=x;anchor.y=y;anchor.vx=anchor.vy=0;swing.p=swing.v=0;
  }
  document.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||!enabled())return;
    mouseX=event.clientX;mouseY=event.clientY;if(!visible)show(mouseX,mouseY);
    aim(event.target);wake();
  },{passive:true});
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'){hide();return;}
    if(!visible||event.button!==0)return;
    pressed=true;filled=filled>=COUNTING_BEADS?1:filled+1;waveFrom=filled-1;waveAt=performance.now();wake();
  },{passive:true});
  const release=()=>{if(pressed){pressed=false;wake();}};
  document.addEventListener('pointerup',release,{passive:true});document.addEventListener('pointercancel',release,{passive:true});
  document.documentElement.addEventListener('pointerleave',hide);
  // Scrolling slides new content under a still mouse, so look again at what is beneath it.
  addEventListener('scroll',()=>{if(visible){recheck=true;wake();}},{passive:true});
  addEventListener('resize',()=>{if(visible){resize();wake();}},{passive:true});
  [motion,finePointer,forcedColors].forEach(query=>query.addEventListener('change',()=>{if(!enabled())hide();}));
})();
