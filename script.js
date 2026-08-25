(function(){
  "use strict";

  /* ---------- language switching ---------- */
  var htmlEl = document.documentElement;
  function setLang(lang){
    htmlEl.setAttribute('data-lang', lang);
    htmlEl.setAttribute('lang', lang);
    document.querySelectorAll('[data-lang-btn]').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === lang);
    });
    try{ localStorage.setItem('smj_lang', lang); }catch(e){}
  }
  var saved = 'ne';
  try{ saved = localStorage.getItem('smj_lang') || 'ne'; }catch(e){}
  setLang(saved);
  document.querySelectorAll('[data-lang-btn]').forEach(function(b){
    b.addEventListener('click', function(e){
      e.preventDefault();
      setLang(b.getAttribute('data-lang-btn'));
    });
  });

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById('nav');
  var navCta = document.getElementById('navCta');
  function onScroll(){
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    navCta.style.display = y > 240 ? 'inline-flex' : 'none';
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- mobile drawer ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('mobileDrawer');
  var scrim = document.getElementById('drawerScrim');
  function toggleDrawer(open){
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    drawer.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function(){ toggleDrawer(!drawer.classList.contains('open')); });
  scrim.addEventListener('click', function(){ toggleDrawer(false); });
  drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ toggleDrawer(false); }); });

  /* ---------- custom cursor ---------- */
  var cursor = document.getElementById('cursor');
  var hasFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(hasFinePointer){
    window.addEventListener('mousemove', function(e){
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .p-card').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('expand'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('expand'); });
    });
    document.querySelectorAll('[data-parallax], .about-media, .quality-media').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('drag'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('drag'); });
    });
  }

  /* ---------- hero parallax ---------- */
  var heroMedia = document.getElementById('heroMedia');
  var heroLight = document.getElementById('heroLight');
  var heroSection = document.getElementById('home');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.innerWidth > 900;

  if(!reduceMotion && isDesktop && heroSection){
    heroSection.addEventListener('mousemove', function(e){
      var r = heroSection.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      if(heroMedia) heroMedia.style.transform = 'translate(' + (px * -14) + 'px,' + (py * -10) + 'px)';
      if(heroLight) heroLight.style.transform = 'translate(' + (px * 40) + 'px,' + (py * 40) + 'px)';
    });
  }

  /* ---------- floating particles ---------- */
  var particleWrap = document.getElementById('particles');
  if(particleWrap){
    var particleCount = window.innerWidth < 700 ? 8 : 20;
    for(var i=0;i<particleCount;i++){
      var p = document.createElement('div');
      p.className = 'particle';
      var size = 2 + Math.random()*3;
      p.style.width = size+'px';
      p.style.height = size+'px';
      p.style.left = Math.random()*100+'%';
      p.style.top = Math.random()*100+'%';
      p.style.animation = 'floatp ' + (10+Math.random()*14) + 's ease-in-out ' + (Math.random()*6) + 's infinite';
      particleWrap.appendChild(p);
    }
    var styleTag = document.createElement('style');
    styleTag.textContent = '@keyframes floatp{0%,100%{transform:translateY(0) translateX(0);opacity:.2;}50%{transform:translateY(-26px) translateX(10px);opacity:.55;}}';
    document.head.appendChild(styleTag);
  }

  /* ---------- marquee content (built from i18n, doubled for loop) ---------- */
  var mqItemsNe = ['स्थानीय उत्पादन','गुणस्तरीय सामग्री','कस्टम समाधान','टिकाउ उत्पादन','भरपर्दो सेवा'];
  var mqItemsEn = ['LOCAL MANUFACTURING','QUALITY MATERIALS','CUSTOM SOLUTIONS','DURABLE PRODUCTS','RELIABLE SERVICE'];
  var track = document.getElementById('marqueeTrack');
  function buildMarquee(){
    if(!track) return;
    track.innerHTML = '';
    for(var rep=0; rep<2; rep++){
      mqItemsNe.forEach(function(t,idx){
        var span = document.createElement('span');
        var neSpan = document.createElement('span'); neSpan.className='ne'; neSpan.textContent=t;
        var enSpan = document.createElement('span'); enSpan.className='en'; enSpan.textContent=mqItemsEn[idx];
        span.appendChild(neSpan); span.appendChild(enSpan);
        track.appendChild(span);
      });
    }
  }
  buildMarquee();

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  revealEls.forEach(function(el){ io.observe(el); });

  /* ---------- gabion in-view ---------- */
  var gabion = document.getElementById('gabionStory');
  if(gabion){
    var gio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        gabion.classList.toggle('in-view', entry.isIntersecting);
      });
    }, {threshold:0.3});
    gio.observe(gabion);
  }

  /* ---------- quality media zoom ---------- */
  var qualityMedia = document.getElementById('qualityMedia');
  if(qualityMedia){
    var qio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ qualityMedia.classList.add('in'); qio.unobserve(qualityMedia); }
      });
    }, {threshold:0.3});
    qio.observe(qualityMedia);
  }

  /* ---------- manufacturing process step activation ---------- */
  var steps = document.querySelectorAll('.p-step');
  var fill = document.getElementById('processFill');
  if(steps.length && fill){
    var pio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var idx = parseInt(entry.target.getAttribute('data-step'), 10);
          for(var j=0;j<=idx;j++){ steps[j].classList.add('active'); }
          fill.style.width = ((idx+1)/steps.length*100) + '%';
        }
      });
    }, {threshold:0.6});
    steps.forEach(function(s){ pio.observe(s); });
  }

  /* ---------- product card 3D tilt (desktop only) ---------- */
  if(hasFinePointer && !reduceMotion){
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      var inner = card.querySelector('.p-card-inner');
      if(!inner) return;
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = 'rotateY(' + (px*7) + 'deg) rotateX(' + (py*-7) + 'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function(){
        inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  /* ---------- contact form (no backend — placeholder handling) ---------- */
  var form = document.getElementById('inquiryForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var lang = htmlEl.getAttribute('data-lang');
      var original = btn.innerHTML;
      btn.innerHTML = lang === 'ne' ? 'पठाइयो ✓' : 'Sent ✓';
      setTimeout(function(){ btn.innerHTML = original; form.reset(); }, 2200);
    });
  }

  /* ---------- hero interactive tab switcher ---------- */
  var tabBtns = document.querySelectorAll('#heroTabs .tab-btn');
  if(tabBtns.length){
    tabBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        tabBtns.forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var imgUrl = this.getAttribute('data-img');
        var titleNe = this.getAttribute('data-title-ne');
        var titleEn = this.getAttribute('data-title-en');
        var specNe = this.getAttribute('data-spec-ne');
        var specEn = this.getAttribute('data-spec-en');
        
        var imgEl = document.getElementById('heroInteractiveImg');
        if(imgEl){
          imgEl.style.opacity = '0';
          setTimeout(function(){
            imgEl.src = imgUrl;
            imgEl.style.display = 'block';
            imgEl.style.opacity = '1';
          }, 180);
        }
        
        var tNe = document.getElementById('hudTitleNe');
        var tEn = document.getElementById('hudTitleEn');
        var sNe = document.getElementById('hudSpecNe');
        var sEn = document.getElementById('hudSpecEn');
        if(tNe) tNe.textContent = titleNe;
        if(tEn) tEn.textContent = titleEn;
        if(sNe) sNe.textContent = specNe;
        if(sEn) sEn.textContent = specEn;
      });
    });
  }

  /* ---------- back to top button ---------- */
  var backToTopBtn = document.getElementById('backToTop');
  if(backToTopBtn){
    backToTopBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var footYear = document.getElementById('footYear');
  if(footYear){
    footYear.textContent = new Date().getFullYear();
  }

})();
