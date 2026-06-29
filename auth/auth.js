/* Cosous — shared status icons for the auth deep-link pages.
   No emoji anywhere: every status uses an inline SVG (see README). */
(function(){
  const ICONS = {
    spinner: '<svg class="spin" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9" stroke-width="2.2"/></svg>',
    check:   '<svg viewBox="0 0 24 24" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>',
    alert:   '<svg viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13.5"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    key:     '<svg viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="5"/><path d="m11 12 9.5-9.5"/><path d="m15.5 6.5 3 3 2.5-2.5-3-3"/></svg>',
    mail:    '<svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6.5 9 6 9-6"/></svg>'
  };

  // Set the status badge icon and tone. tone: 'info' | 'success' | 'error'
  window.setAuthIcon = function(name, tone){
    const el = document.getElementById('icon');
    if(!el) return;
    el.className = 'icon is-' + (tone || 'info');
    el.innerHTML = ICONS[name] || '';
  };
})();
