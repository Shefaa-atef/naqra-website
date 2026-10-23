const phrases=['سُبْحَانَ اللَّهِ','الْحَمْدُ لِلَّهِ','اللَّهُ أَكْبَرُ'];
const labels=['Subhan Allah','Alhamdulillah','Allahu Akbar'];
const counts=[0,0,0];let active=0,arabic=false;
const orbit=document.querySelector('#beads');
for(let i=0;i<33;i++){const bead=document.createElement('span');bead.className='bead';const angle=Math.PI/2+.16+(i/32)*(Math.PI*2-.32);bead.style.setProperty('--x',`${Math.cos(angle)*50}%`);bead.style.setProperty('--y',`${Math.sin(angle)*50}%`);orbit.append(bead);}
function render(){const n=counts[active];document.querySelector('#number').textContent=String(n);document.querySelector('#phrase').textContent=phrases[active];document.querySelector('#count').setAttribute('aria-label',`${arabic?'عدّ':'Count'} ${labels[active]}: ${n}`);document.querySelectorAll('.bead').forEach((b,i)=>b.classList.toggle('filled',i<(n===0?0:(n-1)%33+1)));document.querySelector('#count-caption').textContent=arabic?'نقرةٌ، وذكرٌ':'a moment, a remembrance';document.querySelectorAll('[data-phrase]').forEach((b,i)=>{b.classList.toggle('selected',i===active);b.setAttribute('aria-pressed',String(i===active));});}
document.querySelector('#count').addEventListener('click',()=>{counts[active]++;render();document.querySelector('#demo-status').textContent=`${phrases[active]} ${counts[active]}`;});
document.querySelectorAll('[data-phrase]').forEach(b=>b.addEventListener('click',()=>{active=Number(b.dataset.phrase);render();}));
document.querySelector('#language').addEventListener('click',()=>{arabic=!arabic;document.documentElement.lang=arabic?'ar':'en';document.documentElement.dir=arabic?'rtl':'ltr';document.querySelectorAll('[data-en]').forEach(el=>{el.innerHTML=el.dataset[arabic?'ar':'en'];});const button=document.querySelector('#language');button.textContent=arabic?'English':'العربية';button.setAttribute('aria-label',arabic?'Switch to English':'Switch to Arabic');render();});
let remaining=24*60+38;setInterval(()=>{remaining=remaining>0?remaining-1:24*60+38;document.querySelector('#prayer-time').textContent=`00:${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;},1000);
render();
