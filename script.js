(function(){
  const DATA=window.OX_DATA||{};
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const naira=n=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n).replace('NGN','₦');

  /* Theme */
  let savedTheme=null; try{savedTheme=localStorage.getItem('ox-theme')}catch(e){}
  const preferred=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  document.documentElement.dataset.theme=savedTheme||preferred;
  const updateThemeIcon=()=>{const el=$('.theme-icon'); if(el) el.textContent=document.documentElement.dataset.theme==='light'?'☾':'☼'};
  updateThemeIcon();
  $('#themeToggle')?.addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='light'?'dark':'light';
    document.documentElement.dataset.theme=next; try{localStorage.setItem('ox-theme',next)}catch(e){} updateThemeIcon();
  });

  /* Preloader */
  const pre=$('#preloader'), bar=$('#loaderBar'), lt=$('#loaderText');
  if(pre){
    let p=0; const timer=setInterval(()=>{p=Math.min(100,p+Math.random()*18+7); if(bar)bar.style.width=p+'%'; if(lt){lt.textContent=p<35?'Warming the room':p<72?'Setting the table':'Welcome to OX'}; if(p>=100){clearInterval(timer);setTimeout(()=>pre.classList.add('is-done'),450)}},110);
    window.addEventListener('load',()=>{if(bar)bar.style.width='100%';setTimeout(()=>pre.classList.add('is-done'),550)},{once:true});
  }

  /* Header */
  const header=$('#siteHeader');
  const onScroll=()=>{header?.classList.toggle('scrolled',window.scrollY>32)}; window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  const mobile=$('#mobileMenu'), openMenu=()=>{if(!mobile)return;mobile.classList.add('is-open');mobile.setAttribute('aria-hidden','false');$('#menuToggle')?.setAttribute('aria-expanded','true');document.body.classList.add('menu-open')}, closeMenu=()=>{if(!mobile)return;mobile.classList.remove('is-open');mobile.setAttribute('aria-hidden','true');$('#menuToggle')?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
  $('#menuToggle')?.addEventListener('click',openMenu);
  $('#menuClose')?.addEventListener('click',closeMenu);
  $('.mobile-menu__veil')?.addEventListener('click',closeMenu);
  $$('.mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  /* Premium cursor */
  if(!reduceMotion && matchMedia('(pointer:fine)').matches){
    const cur=$('#cursor'); let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
    cur?.classList.add('is-visible');
    window.addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;cur?.classList.add('is-visible')},{passive:true});
    const loop=()=>{cx+=(x-cx)*.16;cy+=(y-cy)*.16;if(cur)cur.style.left=cx+'px',cur.style.top=cy+'px';requestAnimationFrame(loop)};loop();
    $$('[data-cursor]').forEach(el=>{el.addEventListener('mouseenter',()=>{if(cur){cur.classList.add('is-hover');const s=$('span',cur);if(s)s.textContent=el.dataset.cursor||''}});el.addEventListener('mouseleave',()=>{if(cur){cur.classList.remove('is-hover');const s=$('span',cur);if(s)s.textContent=''}})});
  }

  /* Hero slide */
  const slides=$$('.hero__slide'); let slideIndex=0;
  if(slides.length>1){setInterval(()=>{slides[slideIndex].classList.remove('is-active');slideIndex=(slideIndex+1)%slides.length;slides[slideIndex].classList.add('is-active')},6500)}

  /* GSAP */
  if(window.gsap && !reduceMotion){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach(el=>{
      gsap.to(el,{opacity:1,y:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%',once:true}})
    });
    gsap.utils.toArray('.img-frame img,.story-art img,.private-art img').forEach(img=>{
      gsap.fromTo(img,{scale:1.08},{scale:1,duration:1.35,ease:'power3.out',scrollTrigger:{trigger:img,start:'top 88%',once:true}})
    });
    gsap.utils.toArray('.experience__bg').forEach(bg=>gsap.to(bg,{yPercent:9,ease:'none',scrollTrigger:{trigger:bg.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
    gsap.utils.toArray('.gallery-card').forEach((card,i)=>gsap.from(card,{y:30+(i%3)*12,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 90%',once:true}}));
  }else{$$('.reveal').forEach(e=>{e.style.opacity=1;e.style.transform='none'})}

  /* Gallery lightbox */
  const lb=$('#lightbox'), lbi=$('#lightboxImage');
  $$('.gallery-card').forEach(btn=>btn.addEventListener('click',()=>{if(lbi) {lbi.src=btn.dataset.full; lbi.alt=$('img',btn)?.alt||'OX gallery image'}; lb?.showModal()}));
  $('#lightboxClose')?.addEventListener('click',()=>lb?.close());
  lb?.addEventListener('click',e=>{if(e.target===lb)lb.close()});

  /* Homepage menu preview */
  const preview=$('#homeMenuPreview');
  if(preview){
    const preferredNames=['OX Burger','Oxtail Rigatoni','Grilled Jumbo Prawns','Half Roasted Chicken','Australian Ribeye','Strawberry Cheesecake'];
    const items=preferredNames.map(n=>DATA.foodMenu.find(x=>x.name===n)).filter(Boolean);
    preview.innerHTML=items.map((d,i)=>`<article class="menu-mini"><div><strong>${d.name}</strong><span>${d.category}</span></div><b>${naira(d.price)}</b><small>${d.description||'Prepared to order at OX.'}</small></article>`).join('');
  }

  /* Menu page */
  const menuGrid=$('#menuList');
  if(menuGrid){
    let active='All', query='';
    const categories=['All',...DATA.foodMenu.reduce((a,d)=>a.includes(d.category)?a:[...a,d.category],[])];
    const cats=$('#menuCategories');
    if(cats) cats.innerHTML=categories.map(c=>`<button class="cat-btn ${c==='All'?'is-active':''}" data-cat="${c}">${c}</button>`).join('');
    const render=()=>{
      const filtered=DATA.foodMenu.filter(d=>(active==='All'||d.category===active)&&(!query||(`${d.name} ${d.description} ${d.category}`).toLowerCase().includes(query.toLowerCase())));
      const groups=[];
      filtered.forEach(d=>{let g=groups.find(x=>x.category===d.category);if(!g){g={category:d.category,items:[]};groups.push(g)}g.items.push(d)});
      menuGrid.innerHTML=groups.length?groups.map(g=>`<section class="menu-group"><div class="menu-group-title"><h2>${g.category}</h2><span>${g.items.length} item${g.items.length>1?'s':''}</span></div><div class="dish-grid">${g.items.map(d=>`<article class="dish" data-dish="${d.name.replace(/"/g,'&quot;')}"><div><h3>${d.name}${d.tag?`<span class="dish-tag">${d.tag}</span>`:''}</h3></div><div class="dish-price">${naira(d.price)}</div>${d.description?`<p>${d.description}</p>`:''}</article>`).join('')}</div></section>`).join(''):`<div class="menu-disclaimer">No dishes match your search. Try another dish or category.</div>`;
      const count=$('#menuCount');if(count)count.textContent=`${filtered.length} food item${filtered.length!==1?'s':''}`;
      $$('.dish',menuGrid).forEach(d=>d.addEventListener('click',()=>{const name=d.dataset.dish;window.location.href='order.html?dish='+encodeURIComponent(name)}));
    };
    $$('.cat-btn',cats||document).forEach(b=>b.addEventListener('click',()=>{active=b.dataset.cat;$$('.cat-btn',cats).forEach(x=>x.classList.toggle('is-active',x===b));render()}));
    $('#menuPageSearch')?.addEventListener('input',e=>{query=e.target.value.trim();render()});render();
  }

  /* Order builder */
  const orderList=$('#orderItems'), orderLines=$('#orderLines'), orderTotal=$('#orderTotal');
  if(orderList){
    let active='Appetizers', selected={};
    const groups=[...new Set(DATA.foodMenu.map(d=>d.category))];
    const catWrap=$('#orderCategories');if(catWrap)catWrap.innerHTML=groups.map(c=>`<button class="order-cat ${c===active?'is-active':''}" data-cat="${c}">${c}</button>`).join('');
    const renderItems=()=>{orderList.innerHTML=DATA.foodMenu.filter(d=>d.category===active).map(d=>`<div class="order-item"><div><h3>${d.name}</h3><small>${d.description||'Prepared to order at OX.'}</small></div><div class="order-item__right"><strong>${naira(d.price)}</strong><div class="qty"><button type="button" data-act="minus" data-name="${d.name}">−</button><span>${selected[d.name]||0}</span><button type="button" data-act="plus" data-name="${d.name}">+</button></div></div></div>`).join('');
      $$('[data-act]',orderList).forEach(btn=>btn.addEventListener('click',()=>{const n=btn.dataset.name;selected[n]=(selected[n]||0)+(btn.dataset.act==='plus'?1:-1);if(selected[n]<=0)delete selected[n];renderItems();renderSummary()}));
    };
    const renderSummary=()=>{const entries=Object.entries(selected);orderLines.innerHTML=entries.length?entries.map(([n,q])=>{const d=DATA.foodMenu.find(x=>x.name===n);return `<div class="order-line"><span>${q} × ${n}</span><b>${naira(d.price*q)}</b></div>`}).join(''):`<div class="muted-note">Your order is empty. Add a dish to begin.</div>`;const total=entries.reduce((s,[n,q])=>s+(DATA.foodMenu.find(x=>x.name===n)?.price||0)*q,0);orderTotal.textContent=naira(total);$('#orderPayload')&&(($('#orderPayload').value=entries.map(([n,q])=>`${q} × ${n} — ${naira((DATA.foodMenu.find(x=>x.name===n)?.price||0)*q)}`).join('\n')));$('#orderTotalHidden')&&($('#orderTotalHidden').value=total);};
    $$('[data-cat]',catWrap||document).forEach(b=>b.addEventListener('click',()=>{active=b.dataset.cat;$$('[data-cat]',catWrap).forEach(x=>x.classList.toggle('is-active',x===b));renderItems()}));
    const params=new URLSearchParams(location.search), preselect=params.get('dish');if(preselect){selected[preselect]=1;active=DATA.foodMenu.find(d=>d.name===preselect)?.category||active;$$('[data-cat]',catWrap).forEach(x=>x.classList.toggle('is-active',x.dataset.cat===active))}
    renderItems();renderSummary();
  }

  /* Web3Forms */
  const WEB3_KEY=(window.OX_CONFIG&&window.OX_CONFIG.web3AccessKey)||'YOUR_ACCESS_KEY_HERE';
  $$('.web3-form').forEach(form=>{
    const access=form.querySelector('input[name="access_key"]');if(access)access.value=WEB3_KEY;
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const status=$('.form-status',form);if(status)status.textContent='Sending your request…';
      const fd=new FormData(form);
      if(!fd.get('access_key')||fd.get('access_key')==='YOUR_ACCESS_KEY_HERE'){if(status)status.textContent='Add your Web3Forms access key in config.js before using this form.';return}
      try{const r=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});const data=await r.json();if(data.success){if(status)status.textContent='Received. OX can now review your request.';form.reset();}else{if(status)status.textContent=data.message||'Something went wrong. Please try again.'}}catch(err){if(status)status.textContent='Connection error. Please try again or use WhatsApp.'}
    });
  });

  /* Reservation → WhatsApp */
  $$('[data-whatsapp-reserve]').forEach(btn=>btn.addEventListener('click',()=>{
    const form=btn.closest('form'); if(!form)return; const fd=new FormData(form);
    const name=fd.get('name')||'Guest',date=fd.get('date')||'your preferred date',time=fd.get('time')||'your preferred time',guests=fd.get('guests')||'2 guests',occasion=fd.get('occasion')||'Dinner',note=fd.get('note')||'';
    const msg=`Hello OX Restaurant & Lounge, I would like to request a reservation.%0A%0AName: ${encodeURIComponent(name)}%0ADate: ${encodeURIComponent(date)}%0ATime: ${encodeURIComponent(time)}%0AGuests: ${encodeURIComponent(guests)}%0AOCCASION: ${encodeURIComponent(occasion)}%0ASpecial request: ${encodeURIComponent(note||'None')}`;
    window.open(`https://wa.me/${DATA.contact.whatsapp}?text=${msg}`,'_blank','noopener');
  }));

  /* Order → WhatsApp */
  $('#whatsappOrder')?.addEventListener('click',()=>{
    const entries=[];$$('.order-line',orderLines||document).forEach(line=>entries.push(line.textContent.trim()));
    if(!entries.length){alert('Add at least one dish to your order first.');return}
    const name=$('#orderName')?.value||'Guest';const note=$('#orderNote')?.value||'';const text=`Hello OX Restaurant & Lounge, I would like to place an order request.%0A%0AName: ${encodeURIComponent(name)}%0AItems:%0A${entries.map(x=>encodeURIComponent(x)).join('%0A')}%0A%0ANote: ${encodeURIComponent(note||'None')}`;window.open(`https://wa.me/${DATA.contact.whatsapp}?text=${text}`,'_blank','noopener');
  });

  /* Year */
  $$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();
