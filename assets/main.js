(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const viewer = document.querySelector('.lightbox');
  const photos = [...document.querySelectorAll('[data-photo]')];
  let selected = 0;
  let trigger;
  function showPhoto(index) {
    selected = (index + photos.length) % photos.length;
    const photo = photos[selected];
    viewer.querySelector('figure img').src = photo.dataset.photo;
    viewer.querySelector('figure img').alt = photo.dataset.caption;
    viewer.querySelector('figcaption').textContent = photo.dataset.caption;
    viewer.querySelector('.lightbox-count').textContent = `${String(selected + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  }
  photos.forEach((photo, index) => photo.addEventListener('click', () => {
    trigger = photo; showPhoto(index); viewer.showModal(); document.body.classList.add('viewing'); viewer.querySelector('[data-close]').focus();
  }));
  viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
  viewer.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(selected - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(selected + 1));
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => { document.body.classList.remove('viewing'); trigger?.focus(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(selected - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(selected + 1); }
  });

  const form = document.querySelector('#booking-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const type = form.elements.type;
  const packageSelect = form.elements.package;
  const date = form.elements.date;
  const now = new Date();
  date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  function syncPackages() {
    [...packageSelect.options].forEach(option => { option.disabled = Boolean(option.dataset.type && type.value && option.dataset.type !== type.value); });
    if (packageSelect.selectedOptions[0]?.disabled) packageSelect.value = '';
  }
  type.addEventListener('change', syncPackages);
  packageSelect.addEventListener('change', () => { if (packageSelect.value) { type.value = packageSelect.selectedOptions[0].dataset.type; syncPackages(); } });
  const queryType = new URLSearchParams(location.search).get('type');
  if (['automotive', 'portrait'].includes(queryType)) { type.value = queryType; syncPackages(); }
  document.querySelectorAll('[data-package]').forEach(link => link.addEventListener('click', () => {
    const option = [...packageSelect.options].find(option => option.value === link.dataset.package);
    type.value = option.dataset.type; syncPackages(); packageSelect.value = option.value;
  }));
  const endpoint = window.PORTFOLIO_CONFIG?.bookingEndpoint?.trim() || '';
  if (endpoint) document.querySelector('#integration-notice').textContent = 'Send an inquiry to discuss availability and confirm your session details. An inquiry does not confirm a booking.';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    for (const field of [form.elements.name, form.elements.location]) {
      field.setCustomValidity(field.value.trim() ? '' : 'Please enter a value.');
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
    }
    if (!form.reportValidity()) return;
    if (!endpoint) { status.textContent = 'Your inquiry has not been sent. Online submissions are not configured yet. Your entries remain here.'; return; }
    let url;
    try { url = new URL(endpoint, location.href); if (url.protocol !== 'https:' && url.origin !== location.origin) throw new Error(); }
    catch { status.textContent = 'Your inquiry has not been sent. The submission address is not configured correctly.'; return; }
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true; submit.setAttribute('aria-busy', 'true'); status.textContent = 'Sending your inquiry…';
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('Submission failed');
      status.textContent = 'Your inquiry was received by the submission service. Your session is not confirmed until you receive a personal reply.';
      form.reset(); syncPackages();
    } catch { status.textContent = 'We could not confirm receipt of your inquiry. Your entries remain here. Please try again later.'; }
    finally { submit.disabled = false; submit.removeAttribute('aria-busy'); }
  });
})();
