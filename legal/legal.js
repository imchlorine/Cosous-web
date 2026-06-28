(function(){
  const LANGS = ['en','zh','es','ja'];
  const parts = location.pathname.replace(/\/+$/,'').split('/');
  const file = parts.pop();                 // privacy.html | terms.html
  const folder = parts.pop();               // en | zh | es | ja
  const LANG = LANGS.includes(folder) ? folder : 'en';
  const DOC = file.indexOf('terms') === 0 ? 'terms' : 'privacy';
  document.documentElement.lang = {zh:'zh-CN',es:'es',ja:'ja'}[LANG] || 'en';
  try{ localStorage.setItem('cosous-lang', LANG); }catch(e){}

  const sel = document.getElementById('langSelect');
  if(sel){
    sel.value = LANG;
    sel.addEventListener('change', ()=>{ location.href = '../' + sel.value + '/' + DOC + '.html'; });
  }

  function setText(id, v){ const el = document.getElementById(id); if(el && v != null) el.textContent = v; }

  function render(data){
    const ui = data.ui || {};
    const doc = data[DOC] || {};
    setText('navDownload', ui.navDownload);
    setText('eyebrow', ui.eyebrow);
    setText('title', doc.title);
    setText('updated', (ui.updatedLabel || '') + (doc.updated || ''));
    setText('footFeatures', ui.footFeatures);
    setText('footHelp', ui.footHelp);
    setText('footPrivacy', ui.footPrivacy);
    setText('footTerms', ui.footTerms);
    setText('footCopy', ui.footCopy);
    document.title = (doc.title || 'Legal') + ' — Cosous';

    const intro = document.getElementById('intro');
    if(intro) intro.textContent = doc.intro || '';

    const root = document.getElementById('sections');
    root.innerHTML = '';
    (doc.sections || []).forEach((sec, i)=>{
      const h2 = document.createElement('h2');
      const n = document.createElement('span');
      n.className = 'n';
      n.textContent = (i + 1) + '.';
      h2.appendChild(n);
      h2.appendChild(document.createTextNode(' ' + sec.h));
      root.appendChild(h2);
      const body = document.createElement('div');
      body.innerHTML = sec.body; // trusted, may contain lists/links
      root.appendChild(body);
    });
  }

  fetch('../legal.' + LANG + '.json')
    .then(r=>{ if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(render)
    .catch(err=>{
      const intro = document.getElementById('intro');
      if(intro) intro.textContent = 'Couldn’t load this document. Please try again later.';
      console.error('Failed to load legal.' + LANG + '.json:', err);
    });
})();
