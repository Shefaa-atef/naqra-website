const phrases=['سُبْحَانَ اللَّهِ','الْحَمْدُ لِلَّهِ','اللَّهُ أَكْبَرُ'];
const labels=['Subhan Allah','Alhamdulillah','Allahu Akbar'];
const counts=[0,0,0];let active=0,arabic=false;
const orbit=document.querySelector('#beads');
for(let i=0;i<33;i++){const bead=document.createElement('span');bead.className='bead';const angle=Math.PI/2+.16+(i/32)*(Math.PI*2-.32);bead.style.setProperty('--x',`${Math.cos(angle)*50}%`);bead.style.setProperty('--y',`${Math.sin(angle)*50}%`);orbit.append(bead);}
function render(){const n=counts[active];document.querySelector('#number').textContent=String(n);document.querySelector('#phrase').textContent=phrases[active];document.querySelector('#count').setAttribute('aria-label',`${arabic?'عدّ':'Count'} ${labels[active]}: ${n}`);document.querySelectorAll('.bead').forEach((b,i)=>b.classList.toggle('filled',i<(n===0?0:(n-1)%33+1)));document.querySelector('#count-caption').textContent=arabic?'نقرةٌ، وذكرٌ':'a moment, a remembrance';document.querySelectorAll('[data-phrase]').forEach((b,i)=>{b.classList.toggle('selected',i===active);b.setAttribute('aria-pressed',String(i===active));});}
function countOnce(manual=false){counts[active]++;render();const object=document.querySelector('.hero-object');object.classList.remove('is-clicking');void object.offsetWidth;object.classList.add('is-clicking');if(!motion.matches)playfulCount();if(manual)document.querySelector('#demo-status').textContent=`${phrases[active]} ${counts[active]}`;}
document.querySelector('#count').addEventListener('click',()=>{lastInteraction=Date.now();countOnce(true);});
document.querySelectorAll('[data-phrase]').forEach(b=>b.addEventListener('click',()=>{active=Number(b.dataset.phrase);render();}));
document.querySelector('#language').addEventListener('click',()=>{arabic=!arabic;document.documentElement.lang=arabic?'ar':'en';document.documentElement.dir=arabic?'rtl':'ltr';document.querySelectorAll('[data-en]').forEach(el=>{el.innerHTML=el.dataset[arabic?'ar':'en'];});const button=document.querySelector('#language');button.textContent=arabic?'English':'العربية';button.setAttribute('aria-label',arabic?'Switch to English':'Switch to Arabic');render();});
let remaining=24*60+38;setInterval(()=>{remaining=remaining>0?remaining-1:24*60+38;document.querySelector('#prayer-time').textContent=`00:${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;},1000);
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
const demoButton=document.querySelector('#demo-play');
function updatePlay(){demoButton.setAttribute('aria-pressed',String(playing));demoButton.querySelector('[data-icon]').dataset.icon=playing?'pause':'play';document.querySelector('#demo-play-label').textContent=arabic?(playing?'إيقاف العرض':'تشغيل العرض'):(playing?'Pause demo':'Play demo');paintIcons(demoButton);document.querySelector('.hero-object').classList.toggle('demo-paused',!playing);if(!playing)document.querySelector('.hero-object').classList.remove('pointer-approach');}
demoButton.addEventListener('click',()=>{playing=!playing;updatePlay();});
document.querySelector('#language').addEventListener('click',()=>{paintIcons();updatePlay();});
motion.addEventListener('change',()=>{playing=!motion.matches;updatePlay();});
const heroObject=document.querySelector('.hero-object');let demoVisible=true;
new IntersectionObserver(entries=>{demoVisible=entries[0].isIntersecting;}).observe(heroObject);
setInterval(()=>{if(!playing||document.hidden||!demoVisible||Date.now()-lastInteraction<5500)return;heroObject.classList.add('pointer-approach');setTimeout(()=>{heroObject.classList.remove('pointer-approach');if(!playing||document.hidden||!demoVisible||Date.now()-lastInteraction<5500)return;countOnce();},650);},2800);
document.querySelectorAll('[data-phrase]').forEach(b=>b.addEventListener('click',()=>{lastInteraction=Date.now();}));
updatePlay();
const revealTargets=document.querySelectorAll('.section-intro,.experience-grid article,.quote-layout>*,.intention>*,.answers-section>*,.get-panel');
if('IntersectionObserver' in window){const reveals=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('in-view');reveals.unobserve(e.target);}},{threshold:.12});revealTargets.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${i%2*100}ms`);reveals.observe(el);});}
let scrollPending=false;function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-track i').style.transform=`scaleX(${max>0?scrollY/max:0})`;document.body.classList.toggle('scrolled',scrollY>40);scrollPending=false;}addEventListener('scroll',()=>{if(!scrollPending){requestAnimationFrame(updateScroll);scrollPending=true;}},{passive:true});updateScroll();

// The same strand returns as a loader, a desktop orbit and a footer thread.
document.querySelectorAll('[data-bead-loop]').forEach(loop=>{const n=Number(loop.dataset.beadLoop);for(let i=0;i<n;i++){const bead=document.createElement('i');bead.className='strand-bead';const angle=-Math.PI/2+i/n*Math.PI*2;bead.style.setProperty('--bx',`${Math.cos(angle)*48}%`);bead.style.setProperty('--by',`${Math.sin(angle)*48}%`);bead.style.setProperty('--delay',`${i*.09}s`);loop.append(bead);}});
document.querySelectorAll('[data-bead-line]').forEach(line=>{for(let i=0;i<Number(line.dataset.beadLine);i++){const bead=document.createElement('i');bead.style.setProperty('--delay',`${i*.18}s`);line.append(bead);}});
const menu=document.querySelector('#site-menu'),menuToggle=document.querySelector('#menu-toggle');
function closeMenu(){menu.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label',arabic?'فتح القائمة':'Open menu');menuToggle.querySelector('[data-icon]').dataset.icon='menu';paintIcons(menuToggle);}
menuToggle.addEventListener('click',()=>{const open=!menu.classList.contains('menu-open');menu.classList.toggle('menu-open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',arabic?(open?'إغلاق القائمة':'فتح القائمة'):(open?'Close menu':'Open menu'));menuToggle.querySelector('[data-icon]').dataset.icon=open?'close':'menu';paintIcons(menuToggle);});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.composedPath().includes(menu))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('menu-open')){closeMenu();menuToggle.focus();}});
const navLinks=menu.querySelectorAll('.menu-links a');
// One observer tracks all real destinations.
const destinationObserver=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)navLinks.forEach(a=>{if(a.hash===`#${visible.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-15% 0px -35% 0px',threshold:[0,.1,.35]});
navLinks.forEach(link=>destinationObserver.observe(document.getElementById(link.hash.slice(1))));
document.querySelector('#language').addEventListener('click',closeMenu);
document.querySelector('#year').textContent=String(new Date().getFullYear());
const loadingStarted=performance.now();const loaded=new Promise(resolve=>{if(document.readyState==='complete')resolve();else addEventListener('load',resolve,{once:true});});
Promise.race([Promise.all([loaded,document.fonts.ready]),new Promise(resolve=>setTimeout(resolve,1800))]).then(()=>{setTimeout(()=>document.documentElement.classList.remove('is-loading'),motion.matches?0:Math.max(0,450-(performance.now()-loadingStarted)));});

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
function renderWidgetLabels(){const status=document.querySelector('#prayer-demo-status');const label=prayerDemoMuted?(arabic?'تذكير صامت':'Silent reminder'):(arabic?'معاينة إعداد الصوت':'Sound setting preview');status.textContent=label;status.dataset.en=prayerDemoMuted?'Silent reminder':'Sound setting preview';status.dataset.ar=prayerDemoMuted?'تذكير صامت':'معاينة إعداد الصوت';prayerMute.setAttribute('aria-label',arabic?'كتم الصوت في المعاينة':'Mute sound setting in preview');bookmark.setAttribute('aria-label',arabic?(verseBookmarked?'إلغاء الحفظ في المثال':'حفظ الآية في المثال'):(verseBookmarked?'Remove demo bookmark':'Bookmark this verse in the demo'));document.querySelector('#verse-saved').textContent=verseBookmarked?(arabic?'محفوظة في المثال':'Saved in demo'):'';}
prayerMute.addEventListener('click',()=>{prayerDemoMuted=!prayerDemoMuted;prayerMute.setAttribute('aria-pressed',String(prayerDemoMuted));prayerMute.querySelector('[data-icon]').dataset.icon=prayerDemoMuted?'volume-off':'volume';paintIcons(prayerMute);renderWidgetLabels();});
bookmark.addEventListener('click',()=>{verseBookmarked=!verseBookmarked;bookmark.setAttribute('aria-pressed',String(verseBookmarked));bookmark.querySelector('[data-icon]').dataset.icon=verseBookmarked?'bookmark-filled':'bookmark';paintIcons(bookmark);document.querySelector('.verse-card').classList.toggle('is-bookmarked',verseBookmarked);if(!motion.matches)spring(bookmark,[{transform:'scale(1)'},{transform:'scale(1.22) rotate(-8deg)',offset:.4},{transform:'scale(1) rotate(0deg)'}],{duration:400});renderWidgetLabels();});
const weekSamples=[12,23,18,34,27,42,33],weekNames=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],weekArabic=['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'];let selectedSample=6;
const weekChart=document.querySelector('#week-chart');weekSamples.forEach((value,i)=>{const button=document.createElement('button');button.className='week-bar';button.style.setProperty('--bar-height',`${value/50*100}%`);button.innerHTML=`<span class="week-bar-track"><i></i></span><span class="week-bar-label"></span>`;button.addEventListener('click',()=>{selectedSample=i;renderWeek();if(!motion.matches)spring(document.querySelector('#week-count'),[{opacity:.3,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});});weekChart.append(button);});
function renderWeek(){beadSprings.get(document.querySelector('#week-ring-value'))?.cancel();const value=weekSamples[selectedSample],percent=Math.round(value/50*100);document.querySelector('#week-count').textContent=String(value);document.querySelector('#week-day').textContent=(arabic?weekArabic:weekNames)[selectedSample];document.querySelector('#week-percent').textContent=percent+'%';document.querySelector('#week-ring-value').style.strokeDashoffset=String(251.33*(1-value/50));document.querySelector('#week-total').textContent=String(weekSamples.reduce((a,b)=>a+b,0));weekChart.querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===selectedSample));button.setAttribute('aria-label',`${(arabic?weekArabic:weekNames)[i]}: ${weekSamples[i]}`);button.querySelector('.week-bar-label').textContent=arabic?['ن','ث','ر','خ','ج','س','ح'][i]:['M','T','W','T','F','S','S'][i];});}
renderWeek();renderWidgetLabels();document.querySelector('#language').addEventListener('click',()=>{renderWeek();renderWidgetLabels();});

const beadCord=document.createElementNS('http://www.w3.org/2000/svg','svg');beadCord.setAttribute('viewBox','0 0 100 100');beadCord.setAttribute('class','masbaha-cord');beadCord.setAttribute('aria-hidden','true');
const cordPath=document.createElementNS('http://www.w3.org/2000/svg','path');const start=Math.PI/2+.16,end=Math.PI/2+Math.PI*2-.16;const point=a=>`${50+Math.cos(a)*50} ${50+Math.sin(a)*50}`;cordPath.setAttribute('d',`M ${point(start)} A 50 50 0 1 1 ${point(end)}`);beadCord.append(cordPath);orbit.prepend(beadCord);
// Motion is attached to the control that caused it, with no page-layout shifts.
document.querySelectorAll('.answers-list details').forEach(detail=>detail.addEventListener('toggle',()=>{if(motion.matches||!detail.open)return;spring(detail.querySelector('.answer-dot'),[{transform:'scale(.8) rotate(-12deg)'},{transform:'scale(1.12) rotate(5deg)',offset:.55},{transform:'scale(1) rotate(0deg)'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});spring(detail.querySelector('.answer-body'),[{opacity:.2,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'ease-out'});}));
document.querySelectorAll('.answers-list summary,.salah-mute,.verse-bookmark,.get-button,.menu-toggle').forEach(control=>control.addEventListener('pointerdown',event=>{if(motion.matches)return;const bounds=control.getBoundingClientRect(),ripple=document.createElement('span'),size=Math.max(bounds.width,bounds.height)*2;ripple.className='control-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.cssText=`width:${size}px;height:${size}px;left:${event.clientX-bounds.left}px;top:${event.clientY-bounds.top}px`;control.append(ripple);const animation=ripple.animate([{scale:0,opacity:.8},{scale:1,opacity:0}],{duration:650,easing:'ease-out'});animation.onfinish=()=>ripple.remove();}));
let clockVisible=false;
const clockVisibility=new IntersectionObserver(entries=>{clockVisible=entries[0].isIntersecting;},{threshold:.1});clockVisibility.observe(document.querySelector('.salah-clock'));
new MutationObserver(()=>{if(motion.matches||!clockVisible||document.hidden)return;spring(document.querySelector('#prayer-time'),[{opacity:.65,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});}).observe(document.querySelector('#prayer-time'),{childList:true});
const ringEntrance=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;if(!motion.matches){const ring=document.querySelector('#week-ring-value');spring(ring,[{strokeDashoffset:'251.33'},{strokeDashoffset:ring.style.strokeDashoffset}],{duration:1100,easing:'cubic-bezier(.2,.8,.2,1)'});}ringEntrance.disconnect();},{threshold:.35});ringEntrance.observe(document.querySelector('.week-widget'));
motion.addEventListener('change',()=>{if(!motion.matches)return;document.querySelectorAll('.answer-dot,.answer-body,#prayer-time,#week-ring-value').forEach(el=>beadSprings.get(el)?.cancel());document.querySelectorAll('.control-ripple').forEach(el=>el.remove());});
// The chart pointer demonstrates the same selectable days as a real tap.
const weekWidget=document.querySelector('.week-widget'),weekPlay=document.querySelector('#week-demo-play');
const weekPointer=document.createElement('span');weekPointer.className='week-demo-pointer';weekPointer.setAttribute('aria-hidden','true');weekPointer.innerHTML='<svg viewBox="0 0 32 40" fill="none"><path d="M4 3L27 23L17 24L12 35L4 3Z" fill="#fff7df" stroke="#123e42" stroke-width="2" stroke-linejoin="round"/></svg>';weekChart.append(weekPointer);
let weekPlaying=!motion.matches,weekVisible=false,weekTimer,weekTouchTimer,weekRevision=0;
function stopWeekStep(){clearTimeout(weekTimer);clearTimeout(weekTouchTimer);weekRevision++;}
function renderWeekPlay(){weekPlay.disabled=motion.matches;weekPlay.setAttribute('aria-pressed',String(weekPlaying));weekPlay.querySelector('[data-icon]').dataset.icon=weekPlaying?'pause':'play';document.querySelector('#week-demo-play-label').textContent=motion.matches?(arabic?'حركة مخففة':'Reduced motion'):(arabic?(weekPlaying?'إيقاف العرض':'تشغيل العرض'):(weekPlaying?'Pause demo':'Play demo'));paintIcons(weekPlay);weekWidget.classList.toggle('week-demo-running',weekPlaying&&weekVisible&&!motion.matches);}
function scheduleWeekStep(delay=2200){stopWeekStep();if(!weekPlaying||!weekVisible||motion.matches||document.hidden)return;const revision=weekRevision;weekTimer=setTimeout(()=>{if(revision!==weekRevision)return;const next=(selectedSample+1)%weekSamples.length,bar=weekChart.querySelectorAll('.week-bar')[next],fill=bar.querySelector('i').getBoundingClientRect(),chart=weekChart.getBoundingClientRect();weekWidget.classList.remove('week-demo-resting');weekPointer.style.left=`${(fill.left+fill.width/2-chart.left-3)/chart.width*100}%`;weekPointer.style.top=`${(fill.top+Math.min(12,fill.height/3)-chart.top-2)/chart.height*100}%`;weekTouchTimer=setTimeout(()=>{if(revision!==weekRevision||!weekPlaying||!weekVisible||motion.matches||document.hidden)return;weekPointer.classList.remove('is-touching');void weekPointer.offsetWidth;weekPointer.classList.add('is-touching');spring(weekPointer.querySelector('svg'),[{transform:'scale(1)'},{transform:'scale(.78)',offset:.35},{transform:'scale(1)'}],{duration:350,easing:'ease-out'});bar.click();scheduleWeekStep(2500);},700);},delay);}
function pauseForWeekInput(){stopWeekStep();weekWidget.classList.add('week-demo-resting');if(weekPlaying&&weekVisible&&!motion.matches)scheduleWeekStep(6000);}
weekChart.addEventListener('pointerdown',pauseForWeekInput);weekChart.addEventListener('keydown',pauseForWeekInput);
weekPlay.addEventListener('click',()=>{weekPlaying=!weekPlaying;renderWeekPlay();if(weekPlaying)scheduleWeekStep(300);else{stopWeekStep();weekWidget.classList.add('week-demo-resting');}});
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
