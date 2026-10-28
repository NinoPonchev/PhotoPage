import React, { useState } from 'react';
import data from '../data/site.json';
import { bookingEndpoint } from './config.js';

export default function Booking() {
  const query = new URLSearchParams(location.search).get('type');
  const [type, setType] = useState(['automotive', 'portrait'].includes(query) ? query : '');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const endpoint = bookingEndpoint.trim();
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  function choosePackage(id) {
    setSelectedPackage(id);
    const item = data.packages.find(item => item.id === id);
    if (item) setType(item.type.toLowerCase());
  }
  function changeType(value) {
    setType(value);
    const selected = data.packages.find(item => item.id === selectedPackage);
    if (selected && value && selected.type.toLowerCase() !== value) setSelectedPackage('');
  }
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    for (const name of ['name', 'location']) {
      const field = form.elements.namedItem(name);
      field.setCustomValidity(field.value.trim() ? '' : 'Please enter a value.');
    }
    if (!form.reportValidity()) return;
    if (!endpoint) { setStatus('Your inquiry has not been sent. Online submissions are not configured yet. Your entries remain here.'); return; }
    let url;
    try { url = new URL(endpoint, location.href); if (url.protocol !== 'https:' && url.origin !== location.origin) throw new Error(); }
    catch { setStatus('Your inquiry has not been sent. The submission address is not configured correctly.'); return; }
    setSending(true); setStatus('Sending your inquiry…');
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('Your inquiry was received by the submission service. Your session is not confirmed until you receive a personal reply.');
      form.reset(); setType(''); setSelectedPackage('');
    } catch { setStatus('We could not confirm receipt of your inquiry. Your entries remain here. Please try again later.'); }
    finally { setSending(false); }
  }
  return <><section className="section page-intro"><p className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</p><h1>A vision.<br /><em>A session. A story.</em></h1><p>Choose a starting point. Tell me what you have in mind.<br />We’ll shape the details together.</p></section>
    <section className="section pricing" id="pricing"><div className="section-heading"><div><p className="eyebrow">01 / BOOKING & PRICING</p><h2>Space for <em>your vision.</em></h2></div><p className="placeholder-note">Example packages · editable placeholder prices.<br />Final prices and package details are subject to confirmation.</p></div><div className="price-grid">{data.packages.map(item => <article key={item.id} className={`price-card${item.level === 'Premium' ? ' premium' : ''}`}><div className="price-category">{item.type.toUpperCase()}<span>{item.level === 'Premium' ? 'MORE TIME, MORE POSSIBILITIES' : 'THE STARTING POINT'}</span></div><h3>{item.level}</h3><p className="price">€{item.price}<span> / session</span></p><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul><a className={`button${item.level === 'Premium' ? '' : ' outline'}`} href="#inquiry" onClick={() => choosePackage(item.id)}>Choose {item.level} <span>↗</span></a></article>)}</div></section>
    <section className="section inquiry" id="inquiry"><div><p className="eyebrow">02 / START A CONVERSATION</p><h2>Tell me<br /><em>your idea.</em></h2><p>A place, a person, a car, a feeling.<br />It all starts with a conversation.</p><p className="form-notice">{endpoint ? 'Send an inquiry to discuss availability and confirm your session details. An inquiry does not confirm a booking.' : 'Preview form: online inquiries are not connected yet. This form cannot send a message until a submission service is configured.'}</p></div>
      <form id="booking-form" onSubmit={submit}><div className="form-grid">
        <label>Full name <span>*</span><input name="name" autoComplete="name" required maxLength={120} placeholder="Your full name" onInput={event => event.target.setCustomValidity('')} /></label>
        <label>Email address <span>*</span><input type="email" name="email" autoComplete="email" required maxLength={200} placeholder="you@example.com" /></label>
        <label>Photography type <span>*</span><select name="type" required value={type} onChange={event => changeType(event.target.value)}><option value="">Select photography type</option><option value="automotive">Automotive</option><option value="portrait">Portrait</option></select></label>
        <label>Preferred package <span>*</span><select name="package" required value={selectedPackage} onChange={event => choosePackage(event.target.value)}><option value="">Select a package</option>{data.packages.map(item => <option key={item.id} value={item.id} disabled={Boolean(type && item.type.toLowerCase() !== type)}>{item.type} — {item.level}</option>)}</select></label>
        <label>Preferred date <span>*</span><input type="date" name="date" min={minDate} required /></label>
        <label>Preferred location <span>*</span><input name="location" required maxLength={200} placeholder="City or location" onInput={event => event.target.setCustomValidity('')} /></label>
        <label className="full-width">Additional message<textarea name="message" rows={4} maxLength={5000} placeholder="Tell me a little about your vision…" /></label>
      </div><label className="consent"><input type="checkbox" name="consent" value="agreed" required /><span>I consent to my information being used to respond to this inquiry. I have read the <a href="privacy.html">Privacy Policy</a>. <span aria-hidden="true">*</span></span></label><p className="small-label">* Required fields. An inquiry does not confirm a booking.</p><button className="button" type="submit" disabled={sending} aria-busy={sending}>Send inquiry <span>↗</span></button><p id="form-status" role="status" aria-live="polite">{status}</p></form>
    </section></>;
}
