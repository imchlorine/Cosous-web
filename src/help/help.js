(function(){
  const LANGS = ['en','zh','es','ja'];
  // language is the last path segment, e.g. /help/en/ -> "en"
  const seg = location.pathname.replace(/\/+$/,'').split('/').pop();
  const LANG = LANGS.includes(seg) ? seg : 'en';
  document.documentElement.lang = {zh:'zh-CN',es:'es',ja:'ja'}[LANG] || 'en';
  try{ localStorage.setItem('cosous-lang', LANG); }catch(e){}

  // language switcher -> navigate to sibling language folder
  const sel = document.getElementById('langSelect');
  if(sel){
    sel.value = LANG;
    sel.addEventListener('change', ()=>{ location.href = '../' + sel.value + '/'; });
  }

  const CHEVRON = '<span class="chev"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></span>';
  function setText(id, v){ const el = document.getElementById(id); if(el && v != null) el.textContent = v; }

  function applyUI(ui){
    if(!ui) return;
    setText('navDownload', ui.navDownload);
    setText('eyebrow', ui.eyebrow);
    setText('title', ui.title);
    setText('subtitle', ui.subtitle);
    const s = document.getElementById('faqSearch'); if(s && ui.searchPlaceholder) s.placeholder = ui.searchPlaceholder;
    setText('faqLoading', ui.loading);
    setText('noResults', ui.noResults);
    setText('contactTitle', ui.contactTitle);
    setText('contactText', ui.contactText);
    setText('contactBtn', ui.contactBtn);
    setText('footDesc', ui.footDesc);
    setText('footColProduct', ui.footColProduct);
    setText('footFeatures', ui.footFeatures);
    setText('footHow', ui.footHow);
    setText('footReviews', ui.footReviews);
    setText('footDownload', ui.footDownload);
    setText('footColCompany', ui.footColCompany);
    setText('footAbout', ui.footAbout);
    setText('footBlog', ui.footBlog);
    setText('footCareers', ui.footCareers);
    setText('footColSupport', ui.footColSupport);
    setText('footHelp', ui.footHelp);
    setText('footPrivacy', ui.footPrivacy);
    setText('footTerms', ui.footTerms);
    setText('footCopy', ui.footCopy);
    document.title = (ui.eyebrow || 'Help Center') + ' — Cosous';
  }

  function buildFaq(categories){
    const root = document.getElementById('faqRoot');
    root.innerHTML = '';
    (categories || []).forEach(cat=>{
      const section = document.createElement('div');
      section.className = 'faq-cat';
      const h2 = document.createElement('h2');
      h2.innerHTML = '<span class="dot">●</span> ';
      h2.appendChild(document.createTextNode(cat.title));
      section.appendChild(h2);

      const list = document.createElement('div');
      list.className = 'faq-list';
      (cat.items || []).forEach(item=>{
        const qa = document.createElement('div');
        qa.className = 'qa';
        const btn = document.createElement('button');
        btn.className = 'qa-q';
        btn.innerHTML = '<span></span>' + CHEVRON;
        btn.firstChild.textContent = item.q;
        const ans = document.createElement('div');
        ans.className = 'qa-a';
        const inner = document.createElement('div');
        inner.className = 'qa-a-inner';
        inner.innerHTML = item.a; // answers may contain links
        ans.appendChild(inner);
        qa.appendChild(btn);
        qa.appendChild(ans);
        list.appendChild(qa);
      });
      section.appendChild(list);
      root.appendChild(section);
    });
    wireAccordion();
    wireSearch();
  }

  function wireAccordion(){
    document.querySelectorAll('.qa-q').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const qa = btn.closest('.qa');
        const ans = qa.querySelector('.qa-a');
        if(qa.classList.contains('open')){
          qa.classList.remove('open');
          ans.style.maxHeight = '0px';
        }else{
          qa.classList.add('open');
          ans.style.maxHeight = ans.querySelector('.qa-a-inner').scrollHeight + 'px';
        }
      });
    });
  }

  function wireSearch(){
    const input = document.getElementById('faqSearch');
    const noResults = document.getElementById('noResults');
    input.oninput = ()=>{
      const q = input.value.trim().toLowerCase();
      let anyVisible = false;
      document.querySelectorAll('.faq-cat').forEach(cat=>{
        let catVisible = false;
        cat.querySelectorAll('.qa').forEach(qa=>{
          const match = q === '' || qa.textContent.toLowerCase().includes(q);
          qa.style.display = match ? '' : 'none';
          if(match) catVisible = true;
          if(q !== ''){ qa.classList.remove('open'); qa.querySelector('.qa-a').style.maxHeight = '0px'; }
        });
        cat.style.display = catVisible ? '' : 'none';
        if(catVisible) anyVisible = true;
      });
      noResults.classList.toggle('show', !anyVisible);
    };
  }

  fetch('../faq.' + LANG + '.json')
    .then(r=>{ if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(data=>{
      applyUI(data.ui);
      document.getElementById('faqLoading').style.display = 'none';
      buildFaq(data.categories);
    })
    .catch(err=>{
      const l = document.getElementById('faqLoading');
      l.textContent = 'Couldn’t load help articles. Please try again later.';
      console.error('Failed to load faq.' + LANG + '.json:', err);
    });
})();
