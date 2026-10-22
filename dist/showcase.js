(() => {
  'use strict';
  const scene=document.querySelector('#showcase-scene');
  const preview=document.querySelector('#screen-preview');
  const toggle=document.querySelector('#toggle-3d');
  const angleButton=document.querySelector('#change-angle');
  const status=document.querySelector('#model-status');
  const modelId='57ad4ef2e8294ed884be642a0ef42df6';
  const textureCache=new Map();
  let currentScreen='home',api,screenMaterial,textureUid,defaultCamera,baselineFov,ready=false,loading=false,want3d=false,angled=false;
  let revision=0,textureQueue=Promise.resolve();
  const isArabic=()=>document.documentElement.lang==='ar';
  const labels={home:['Home','الرئيسية'],wird:['Daily wird','وردي اليومي'],library:['Library','المكتبة'],reminders:['Reminders','التذكيرات']};
  const screenUrl=()=>new URL(`assets/screens/${currentScreen}-${isArabic()?'ar':'en'}.jpg`,document.baseURI).href;
  function updateLabels(){
    toggle.textContent=loading?(isArabic()?'جارٍ تحميل المجسّم…':'Loading 3D…'):want3d&&ready?(isArabic()?'عرض ثابت ◇':'Still view ◇'):(isArabic()?'استكشف بالأبعاد الثلاثية ◇':'Explore in 3D ◇');
    toggle.setAttribute('aria-pressed',String(want3d&&ready));
    status.textContent=want3d&&ready?(isArabic()?'اسحب لتدوير الشاشة':'Drag to rotate the monitor'):(isArabic()?'معاينة ثابتة':'Still preview');
    angleButton.hidden=!(want3d&&ready);
  }
  function mode(){scene.classList.toggle('is-3d',want3d&&ready);updateLabels();}
  function textureData(url){
    if(textureCache.has(url))return textureCache.get(url);
    const promise=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;canvas.getContext('2d').drawImage(image,0,0);resolve(canvas.toDataURL('image/jpeg',0.94));};image.onerror=()=>reject(new Error('Screen image unavailable'));image.src=url;});
    textureCache.set(url,promise);return promise;
  }
  const invoke=(name,...args)=>new Promise((resolve,reject)=>api[name](...args,(error,result)=>error?reject(error):resolve(result)));
  async function applyScreen(url,version){
    const data=await textureData(url);if(version!==revision)return;
    if(textureUid){await invoke('updateTexture',data,textureUid);return;}
    textureUid=await invoke('addTexture',data);
    screenMaterial.shadeless=true;
    for(const name of ['DiffuseColor','AlbedoPBR']){const channel=screenMaterial.channels[name];channel.enable=true;channel.factor=1;channel.texture={uid:textureUid,texCoordUnit:0};}
    screenMaterial.channels.EmitColor.enable=false;
    screenMaterial.channels.Matcap.enable=false;
    screenMaterial.channels.SpecularColor.factor=0;
    await invoke('setMaterial',screenMaterial);
  }
  function selectScreen(){
    const url=screenUrl(),version=++revision;
    preview.src=url;
    preview.alt=`Naqra ${labels[currentScreen][isArabic()?1:0]} — ${isArabic()?'واجهة عربية':'English interface'}`;
    document.querySelectorAll('[data-screen]').forEach(button=>{const selected=button.dataset.screen===currentScreen;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
    if(ready&&api&&screenMaterial)textureQueue=textureQueue.then(()=>applyScreen(url,version)).catch(()=>{want3d=false;mode();});
    updateLabels();
  }
  function sdk(){return new Promise((resolve,reject)=>{if(window.Sketchfab){resolve();return;}const script=document.createElement('script');script.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});}
  async function load3d(){
    if(ready){want3d=true;mode();return;}if(loading)return;
    loading=true;want3d=true;updateLabels();
    const watchdog=setTimeout(()=>{loading=false;want3d=false;mode();},25000);
    try{
      await sdk();const client=new window.Sketchfab(document.querySelector('#monitor-viewer'));
      client.init(modelId,{autostart:1,preload:1,transparent:1,scrollwheel:0,ui_infos:0,ui_controls:0,ui_stop:0,ui_hint:0,camera:0,
        success(viewer){api=viewer;api.start();api.addEventListener('viewerready',async()=>{
          try{const materials=await invoke('getMaterialList');screenMaterial=materials.find(material=>material.stateSetID===3);if(!screenMaterial)throw new Error('Screen not found');
            let appliedRevision;do{appliedRevision=revision;await applyScreen(screenUrl(),appliedRevision);}while(appliedRevision!==revision);
            defaultCamera=await invoke('getCameraLookAt');baselineFov=await invoke('getFov');await invoke('setFov',Math.max(10,baselineFov*(window.innerWidth>700?0.68:1)));clearTimeout(watchdog);ready=true;loading=false;mode();
          }catch{clearTimeout(watchdog);loading=false;want3d=false;mode();}
        });},
        error(){clearTimeout(watchdog);loading=false;want3d=false;mode();}
      });
    }catch{clearTimeout(watchdog);loading=false;want3d=false;mode();}
  }
  document.querySelectorAll('[data-screen]').forEach(button=>button.addEventListener('click',()=>{currentScreen=button.dataset.screen;selectScreen();}));
  toggle.addEventListener('click',()=>{if(ready){want3d=!want3d;mode();}else load3d();});
  angleButton.addEventListener('click',()=>{if(!defaultCamera)return;angled=!angled;const target=defaultCamera.target,offset=defaultCamera.position.map((value,i)=>value-target[i]);const angle=angled?0.24:0;const position=[target[0]+offset[0]*Math.cos(angle)-offset[1]*Math.sin(angle),target[1]+offset[0]*Math.sin(angle)+offset[1]*Math.cos(angle),defaultCamera.position[2]];api.setCameraLookAt(position,target,window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:1.2);});
  const dialog=document.querySelector('#screen-dialog');
  document.querySelector('#open-screen').addEventListener('click',()=>{const image=document.querySelector('#large-screen');image.src=screenUrl();image.alt=preview.alt;dialog.showModal();});
  document.querySelector('#close-screen').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  new MutationObserver(selectScreen).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('resize',()=>{if(ready&&baselineFov)api.setFov(Math.max(10,baselineFov*(window.innerWidth>700?0.68:1)));});
  selectScreen();
  // Desktop visitors see the actual model; mobile and reduced-motion visitors
  // can opt into it without paying the loading cost before seeing the product.
  if(window.innerWidth>700&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){new IntersectionObserver((entries,observer)=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();load3d();}},{rootMargin:'150px'}).observe(scene);}
})();
