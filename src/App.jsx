import React, { useEffect } from 'react';
import data from '../data/site.json';
import legal from '../data/legal.json';
import { Header, Footer, Hero, Photo, Gallery, CallToAction } from './components.jsx';
import Booking from './Booking.jsx';

const cars = data.photos.filter(photo => photo.category === 'automotive');
const portraits = data.photos.filter(photo => photo.category === 'portrait');

function Home() {
  return <><Hero item={cars[2]} eyebrow="INDEPENDENT PHOTOGRAPHY / AUTOMOTIVE & PORTRAIT" text="Automotive & Portrait Photography" home>Capturing Motion.<br /><em>Creating Emotion.</em></Hero>
    <section className="section" id="portfolio"><div className="section-heading"><div><p className="eyebrow">01 / TWO WORLDS. ONE PERSPECTIVE.</p><h2>Driven by detail.<br /><em>Defined by feeling.</em></h2></div><p>From sculpted metal to unguarded moments.<br />Explore the stories on either side of the lens.</p></div><div className="categories">{[[cars[0], 'Automotive Photography', 'cars.html', 'Design. Detail. Presence.'], [portraits[2], 'Portrait Photography', 'portraits.html', 'Personality. Light. Connection.']].map(([item, title, href, subtitle]) => <a key={href} className="category" href={href}><Photo item={item} /><div><span className="eyebrow">{subtitle}</span><h3>{title} <span>↗</span></h3></div></a>)}</div></section>
    <section className="section featured"><div className="section-heading"><div><p className="eyebrow">02 / SELECTED WORK</p><h2>A closer <em>look.</em></h2></div><p>A selection of automotive and portrait work.<br />Click a photograph to see the whole picture.</p></div><Gallery photos={[cars[1], portraits[0], portraits[3], cars[3], portraits[1], cars[2]]} editorial /></section>
    <section className="section about"><div><p className="eyebrow">03 / BEHIND THE LENS</p><h2>Every frame<br />starts with<br /><em>a connection.</em></h2></div><div><span className="small-label">NINO PONCHEV / PHOTOGRAPHER</span><p className="large-copy">I’m Nino Ponchev, a photographer drawn to character — in the lines of a vehicle and in the people in front of my lens.</p><p>[Add your background, location, and approach here.] My work brings together thoughtful composition, expressive light, and attention to the details that make a photograph feel personal.</p><a className="text-link" href="booking.html#inquiry">Let’s make your vision tangible <span>↗</span></a></div></section><CallToAction /></>;
}

function Portfolio({ automotive }) {
  const photos = automotive ? cars : portraits;
  const category = automotive ? 'Automotive' : 'Portrait';
  const intro = automotive ? 'The lines. The light. The feeling. Thoughtful automotive imagery that brings the design, details, and character of your vehicle into focus.' : 'Authentic personality, expressive light, and space to be yourself. Portraits that capture a feeling as much as a face.';
  const services = automotive ? ['Automotive portraits', 'Detail photography', 'Automotive lifestyle photography'] : ['Individual portraits', 'Lifestyle portraits', 'Outdoor photography', 'Professional headshots'];
  return <><Hero item={photos[2]} eyebrow={`${automotive ? '01' : '02'} / THE PORTFOLIO`} text={intro} number={automotive ? '02' : '03'}>{category}<br /><em>Photography.</em></Hero><section className="section" id="portfolio"><div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Character in <em>focus.</em></h2></div><p>Explore the full frame.<br />Select any photograph to enlarge.</p></div><Gallery photos={photos} /></section><section className="section services"><div><p className="eyebrow">MADE AROUND YOU</p><h2>Your story.<br /><em>Your session.</em></h2></div><div>{services.map((service, index) => <div className="service-row" key={service}><span>0{index + 1}</span><h3>{service}</h3><span>↗</span></div>)}</div></section><CallToAction label={automotive ? 'Book an Automotive Shoot' : 'Book a Portrait Session'} href={`booking.html?type=${category.toLowerCase()}#inquiry`} /></>;
}

function Legal({ page }) {
  const [title, sections] = legal[`${page}.html`];
  return <><section className="section page-intro"><p className="eyebrow">LEGAL / EDITABLE PLACEHOLDER</p><h1>{title}</h1><p>Draft content — complete and review before publication.</p></section><section className="section legal-copy">{sections.map(([heading, copy]) => <article key={heading}><h2>{heading}</h2><p style={{ whiteSpace: 'pre-line' }}>{copy}</p></article>)}</section></>;
}

export default function App() {
  const filename = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const page = filename.replace(/\.html$/, '');
  useEffect(() => {
    // The React content mounts after the browser's initial fragment lookup.
    if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
  }, []);
  let content;
  if (page === 'cars' || page === 'portraits') content = <Portfolio automotive={page === 'cars'} />;
  else if (page === 'booking') content = <Booking />;
  else if (page === 'impressum' || page === 'privacy') content = <Legal page={page} />;
  else content = <Home />;
  return <><Header page={page} /><main id="main">{content}</main><Footer /></>;
}
