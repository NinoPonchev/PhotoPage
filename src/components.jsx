import React, { useEffect, useRef, useState } from 'react';

export function Photo({ item, hero = false }) {
  const stem = item.file.replace(/\.[^.]+$/, '');
  return <img src={`images/web/${stem}-${hero ? 1920 : 1200}.jpg`}
    srcSet={[600, 1200, 1920].map(width => `images/web/${stem}-${width}.jpg ${width}w`).join(', ')}
    sizes={hero ? '100vw' : '(max-width: 700px) 100vw, 50vw'} width={item.width} height={item.height}
    alt={item.alt} loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : undefined} decoding="async" />;
}

export function Header({ page }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    const close = () => setOpen(false);
    const escape = event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    const breakpoint = matchMedia('(min-width: 701px)');
    breakpoint.addEventListener('change', close);
    if (open) document.addEventListener('keydown', escape);
    return () => { breakpoint.removeEventListener('change', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header">
    <a className="brand" href="index.html" aria-label="Evo Style Photography home"><span className="brand-mark">ES</span><span className="brand-name">EVO STYLE<span>PHOTOGRAPHY</span></span></a>
    <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>Menu <span aria-hidden="true">☰</span></button>
    <nav id="navigation" className={open ? 'open' : ''} aria-label="Main navigation" onClick={event => { if (event.target.closest('a')) setOpen(false); }}>
      {[['index', 'Home'], ['cars', 'Cars'], ['portraits', 'Portraits'], ['booking', 'Booking & Pricing']].map(([id, label]) => <a key={id} href={`${id}.html`} aria-current={page === id ? 'page' : undefined}>{label}</a>)}
      <a className="nav-cta" href="booking.html#inquiry">Let’s talk <span>↗</span></a>
    </nav></header></>;
}

export function Footer() {
  return <footer><div className="footer-top"><a className="brand footer-brand" href="index.html">NINO PONCHEV<span>PHOTOGRAPHY</span></a><p>Motion. Emotion. A different perspective.</p><div className="footer-contact"><a href="https://www.instagram.com/your_username/" rel="noopener noreferrer">Instagram ↗ (placeholder)</a><a href="mailto:hello@example.com">hello@example.com (placeholder)</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Nino Ponchev Photography</span><div><a href="impressum.html">Impressum</a><a href="privacy.html">Privacy Policy</a><a href="#main">Back to top ↑</a></div></div></footer>;
}

export function Hero({ item, eyebrow, children, text, home = false, number = '01' }) {
  return <section className={`hero ${home ? 'home-hero' : 'portfolio-hero'}`}><Photo item={item} hero /><div className="hero-shade" /><div className="hero-content"><p className="eyebrow">{eyebrow}</p><h1>{children}</h1><p className="hero-subtitle">{text}</p>{home && <div className="hero-actions"><a className="button" href="#portfolio">Explore Portfolio <span>↗</span></a><a className="text-link" href="booking.html#inquiry">Book a Session <span>↗</span></a></div>}</div><div className="hero-bottom"><span>{home ? 'AUTOMOTIVE & PORTRAIT' : 'A STUDY IN LIGHT & CHARACTER'}</span><a href="#portfolio">SCROLL TO EXPLORE ↓</a><span>PORTFOLIO / {number}</span></div></section>;
}

export function CallToAction({ label = 'Start a conversation', href = 'booking.html#inquiry' }) {
  return <section className="cta section"><span className="eyebrow">YOUR NEXT FRAME</span><h2>Let’s Create Something Extraordinary.</h2><a className="button" href={href}>{label} <span>↗</span></a></section>;
}

export function Gallery({ photos, editorial = false }) {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const closeButton = useRef(null);
  const item = selected === null ? null : photos[selected];
  const move = amount => setSelected(index => (index + amount + photos.length) % photos.length);
  useEffect(() => {
    if (selected === null) return;
    if (!dialog.current.open) { dialog.current.showModal(); closeButton.current.focus(); }
    document.body.classList.add('viewing');
    return () => document.body.classList.remove('viewing');
  }, [selected]);
  const close = () => { dialog.current.close(); setSelected(null); trigger.current?.focus(); };
  return <><div className={`gallery${editorial ? ' editorial' : ''}`}>{photos.map((photo, index) => <button key={photo.file} className="gallery-item" type="button" aria-label={`Enlarge: ${photo.alt}`} onClick={event => { trigger.current = event.currentTarget; setSelected(index); }}><Photo item={photo} /><span className="photo-caption"><span>{photo.title}</span><span>{String(index + 1).padStart(2, '0')} ↗</span></span></button>)}</div>
    <dialog ref={dialog} className="lightbox" aria-label="Photo viewer" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
      <div className="lightbox-toolbar"><span className="lightbox-count">{selected !== null && `${String(selected + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`}</span><button ref={closeButton} type="button" aria-label="Close photo viewer" onClick={close}>Close ×</button></div>
      <button className="lightbox-prev" type="button" aria-label="Previous photograph" onClick={() => move(-1)}>←</button>
      {item && <figure><img src={`images/web/${item.file.replace(/\.[^.]+$/, '')}-1920.jpg`} alt={item.alt} /><figcaption>{item.alt}</figcaption></figure>}
      <button className="lightbox-next" type="button" aria-label="Next photograph" onClick={() => move(1)}>→</button>
    </dialog></>;
}
