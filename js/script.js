/* ════════════════════════════════════════
       JAVASCRIPT
  ════════════════════════════════════════ */

    // ── Custom Cursor ─────────────────────────────
    const cur  = document.getElementById('cur');
    const ring = document.getElementById('ring');
    let mx=0, my=0, rx=0, ry=0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx+'px'; cur.style.top = my+'px';
    });

    (function animRing(){
      rx += (mx-rx)*.11; ry += (my-ry)*.11;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a,button,.gbtn,.wcard,.tcard,#pika-hero').forEach(el => {
      el.addEventListener('mouseenter', ()=>{
        cur.style.transform  = 'translate(-50%,-50%) scale(0)';
        ring.style.width     = '50px'; ring.style.height = '50px';
        ring.style.borderColor = 'rgba(184,167,255,.5)';
      });
      el.addEventListener('mouseleave', ()=>{
        cur.style.transform  = 'translate(-50%,-50%) scale(1)';
        ring.style.width     = '30px'; ring.style.height = '30px';
        ring.style.borderColor = 'rgba(255,255,255,.25)';
      });
    });


    // ── Theme Toggle ─────────────────────────────
    const toggle = document.getElementById('themeToggle');
    // stylesheet link (added id="theme-style" in HTML)
    const themeLink = document.getElementById('theme-style') || document.querySelector('link[rel="stylesheet"]');

    // small helper to fade an overlay in/out around the stylesheet swap
    function fadeThemeSwap(targetHref, targetIsLight) {
      // overlay colors chosen to match theme background tokens
      const lightBg = '#f0ede8';
      const darkBg  = '#080810';

      let overlay = document.getElementById('theme-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'theme-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999998;opacity:0;transition:opacity .45s ease;';
        document.body.appendChild(overlay);
      }

      overlay.style.background = targetIsLight ? lightBg : darkBg;

      // fade in
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });

      // when the stylesheet finishes loading, fade out overlay and update UI
      function onLoaded() {
        themeLink.removeEventListener('load', onLoaded);
        document.body.classList.toggle('light', targetIsLight);
        if (toggle) toggle.textContent = targetIsLight ? '☀️' : '🌙';
        // short pause so the new styles settle visually
        setTimeout(() => { overlay.style.opacity = '0'; }, 80);
      }

      themeLink.addEventListener('load', onLoaded);

      // swap href after a tiny delay to let the fade start
      setTimeout(() => { themeLink.href = targetHref; }, 140);
      localStorage.setItem('theme', targetIsLight ? 'light' : 'dark');
    }

    // helper to set theme; if initial=true then swap href without animation
    function applyTheme(mode, initial = false) {
      const isLight = mode === 'light';
      const href = isLight ? '/css/light.css' : '/css/dark.css';

      if (!themeLink) {
        document.body.classList.toggle('light', isLight);
        if (toggle) toggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        return;
      }

      if (initial) {
        // no fade on initial load — just set stylesheet and class
        themeLink.href = href;
        document.body.classList.toggle('light', isLight);
        if (toggle) toggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      } else {
        fadeThemeSwap(href, isLight);
      }
    }

    // initialize from localStorage (do not animate on initial load)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      applyTheme('light', true);
    } else if (savedTheme === 'dark') {
      applyTheme('dark', true);
    } else {
      // no saved theme — ensure default stylesheet set to dark quietly
      if (themeLink && !themeLink.href.includes('dark.css') && !themeLink.href.includes('light.css')) {
        themeLink.href = '/css/dark.css';
      }
      if (toggle) toggle.textContent = '☀️';
    }

    // Toggle click — swap the stylesheet href and store preference (use fade)
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light');
        applyTheme(isLight ? 'dark' : 'light', false);
      });

      // Drag functionality
      let isDragging = false;

      toggle.addEventListener('mousedown', () => {
        isDragging = true;
        toggle.style.cursor = 'grabbing';
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        toggle.style.cursor = 'grab';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        toggle.style.top = e.clientY + 'px';
      });
    }


    // ── Glass liquid sheen ───────────────────────
    document.querySelectorAll('.glass').forEach(g => {
      g.addEventListener('mousemove', e => {
        const r = g.getBoundingClientRect();
        g.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
        g.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
      });
    });

    // ── Scroll fade-in ───────────────────────────
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('on'); }),
      { threshold:.1 }
    );
    document.querySelectorAll('.fi').forEach(el => obs.observe(el));

    // ── Scroll Reward #1 ─────────────────────────
    let r1done = false;
    new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !r1done) {
        r1done = true;
        document.getElementById('sr1').classList.add('on');
        setTimeout(() => {
          const pr = document.getElementById('pika-r');
          pr.style.display = 'block';
        }, 500);
      }
    }, {threshold:.5}).observe(document.getElementById('sr1'));

    // ── Pikachu Hero ─────────────────────────────
    const ph = document.getElementById('pika-hero');
    ph.addEventListener('click', () => {
      ph.classList.add('zap');
      ph.textContent = '⚡🌟⚡';
      setTimeout(() => { ph.classList.remove('zap'); ph.textContent = '⚡'; }, 700);
    });

    // ── Aspect Ratio Playground ──────────────────
    const formats = [
      { label:'1:1',  name:'square',        w:320, h:320 },
      { label:'4:5',  name:'portrait',      w:285, h:356 },
      { label:'9:16', name:'story / reel',  w:225, h:400 },
      { label:'16:9', name:'banner',        w:500, h:281 },
    ];
    let curFmt = 0, cycling = false;
    const af = document.getElementById('aframe');
    const al = document.getElementById('alabel');
    const an = document.getElementById('aname');
    const dots = document.querySelectorAll('.adot');

    function setFmt(i) {
      const f = formats[i]; curFmt = i;
      af.style.width  = f.w+'px';
      af.style.height = f.h+'px';
      al.textContent  = f.label;
      an.textContent  = f.name;
      dots.forEach((d,j) => d.classList.toggle('on', j===i));
    }

    new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !cycling) {
        cycling = true;
        let i=0;
        const id = setInterval(()=>{
          i=(i+1)%formats.length; setFmt(i);
          if(i===formats.length-1) clearInterval(id);
        }, 1300);
      }
    }, {threshold:.5}).observe(document.getElementById('aspect'));

    dots.forEach(d => d.addEventListener('click', () => setFmt(+d.dataset.i)));

    // ── Carousel: safe init + JS loop ───────────
    // - ensure duplication runs only once
    // - wait for images to load before measuring width
    // - use modulo wrap to avoid drift so it never stops looping
    (function initCarousel(){
      const ct = document.getElementById('ctrack');
      if (!ct) return;

      // avoid double-initializing if this script is ever run twice
      if (ct.dataset.carouselInited) return;
      ct.dataset.carouselInited = '1';

      // duplicate items to allow seamless scroll
      ct.innerHTML += ct.innerHTML;
      // disable any CSS animation — we'll drive motion via JS
      ct.style.animation = 'none';

      // wait for images inside the track to load so measurements are accurate
      const imgs = Array.from(ct.querySelectorAll('img'));
      const imgPromises = imgs.map(img => {
        if (img.complete && img.naturalWidth) return Promise.resolve();
        return new Promise(resolve => { img.addEventListener('load', resolve); img.addEventListener('error', resolve); });
      });

      Promise.all(imgPromises).then(() => {
        // px per second scrolling speed — tweak this value to change speed
        const pxPerSecond = 60;
        let last = performance.now();
        let offset = 0;

        // measure width of one set (half the scrollWidth because we duplicated)
        let fullWidth = ct.scrollWidth / 2 || 1;

        // in case fonts/images cause layout shifts later, update fullWidth periodically
        setInterval(() => { fullWidth = ct.scrollWidth / 2 || 1; }, 1000);

        function step(now) {
          const dt = Math.max(0, now - last) / 1000;
          last = now;
          offset = (offset + pxPerSecond * dt) % fullWidth;
          ct.style.transform = `translate3d(-${offset}px,0,0)`;
          requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });
    })();

    // ── Scroll Reward #2 + Pikachu Run ───────────
    let r2done = false;
    new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !r2done) {
        r2done = true;
        document.getElementById('sr2').classList.add('on');
        const pr = document.getElementById('pika-run');
        pr.style.animation = 'pikarun 2.2s cubic-bezier(.4,0,.2,1) forwards';
        setTimeout(() => {
          pr.style.animation = '';
          pr.style.bottom = '-80px'; pr.style.left = '-80px';
        }, 2400);
      }
    }, {threshold:.5}).observe(document.getElementById('sr2'));
