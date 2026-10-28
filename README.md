# Nino Ponchev Photography — React

The portfolio now renders with React and Vite. The design, photographs, six page URLs, responsive layout, lightboxes, packages, legal drafts, and booking validation are preserved. Shared UI uses React components and hooks. The old DOM manipulation script is no longer loaded.

The GitHub repository includes only optimized photographs in `public/images/web/`. Full-resolution originals in `images/` remain local and are ignored by Git. A clone can run and build without originals. Local screenshots and prior hosting preparation are also excluded.

## Run locally

Requires Node.js 22.12+ or a supported newer version. In this project folder:

```powershell
npm ci
npm run dev
```

Open the URL printed by Vite (normally http://127.0.0.1:5173). Stop with Ctrl+C. If npm is not on your Windows PATH, run this first:

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
```

The React source needs the development server. Double-clicking index.html is no longer the preview workflow.

## Production build

```powershell
npm run build
npm run check
npm run preview
```

The build generates `dist/`. Preview serves that production output, normally at http://127.0.0.1:4173. Deploy only `dist/` to a static host. The existing six HTML URLs support direct loads and refreshes, without a router dependency or catch-all rewrite.

## Structure

```text
src/
  main.jsx               React entry and shared CSS import
  App.jsx                Home, portfolios, legal pages, page selection
  components.jsx         Header, footer, hero, photo, gallery/lightbox, CTA
  Booking.jsx            Pricing, package selection, validation, submission
  config.js              Active booking endpoint configuration
public/

  favicon.svg            NP favicon
  images/web/            30 responsive JPEGs shipped in the build
assets/
  style.css              Active responsive styles
  main.js, config.js,
  favicon.svg            Historical assets; no longer loaded
images/
  [10 original JPEGs]    Preserved; not shipped in production
  web/                   Source optimized JPEG copies
data/
  site.json              Photo manifest and editable package data
  legal.json             Editable legal drafts
scripts/
  optimize-images.ps1    Generate resized copies on Windows
  check-assets.mjs       Check built pages, bundles, metadata and images
  build.py, check.py     Disabled old commands; direct you to npm
legacy-html/
  [6 HTML files]
  assets/                Backup of the original static markup and assets
published-site/          Earlier unpublished static upload preparation
index.html               Home entry and metadata
cars.html                Automotive entry and metadata
portraits.html           Portrait entry and metadata
booking.html             Booking entry and metadata
impressum.html            Legal entry and metadata
privacy.html             Privacy entry and metadata
vite.config.js           Six-page Vite build configuration
package.json             Commands and dependency declarations
package-lock.json        Locked dependency versions; use npm ci
vercel.json              Vite build/output configuration and headers
.gitignore
.vercelignore
README.md
contact-sheet.jpg        Original photo classification reference
preview-home.png         Original static site screenshot
preview-react.png        Verified React homepage screenshot
```

The legacy markup is an archive and retains its original relative paths. `published-site/` is the previous static hosting preparation, not the React output. This conversion does not publish or change private hosting access.

## Edit content

- Name/navigation/footer: `src/components.jsx`. Biography and page copy: `src/App.jsx`. Page titles and descriptions: the six root HTML entries.
- Prices/packages: edit `packages` in `data/site.json`. Keep IDs unique and types Automotive or Portrait. React imports the data directly; no Python generation is needed.
- Styling: `assets/style.css`.
- Legal drafts: `data/legal.json`. Complete and review these for the actual business and providers before publication.

## Add photographs

1. Add a JPEG with a unique basename to `images/`. Preserve the original and make sure it is correctly rotated.
2. Add its actual filename, category (`automotive` or `portrait`), original width/height, title and descriptive alt text to `data/site.json`.
3. Generate and copy responsive assets:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/optimize-images.ps1
Copy-Item -Path images/web/* -Destination public/images/web -Force
```

4. Run `npm run build` and `npm run check`. The relevant gallery updates automatically. Homepage selections and hero choices are in `src/App.jsx`.

Full gallery/lightbox images retain their proportions. Hero and category images crop to fill their layouts. Original photographs are not included in `dist/`.

## Receive real inquiries

Set `bookingEndpoint` in **src/config.js** to a real HTTPS endpoint, such as a configured Formspree form or a same-origin `/api/inquiry` function. It is empty by default. The form validates inputs and explicitly says nothing was sent when unconfigured.

The endpoint receives JSON POST fields: name, email, type, package, date, location, optional message, and consent. It must allow the site's origin and return a 2xx status only after accepting an inquiry. Put private mail/API credentials on the server, and add server validation and spam protection to a custom endpoint. Configure the recipient, update the contact/legal placeholders, and test actual delivery before going live. An inquiry does not confirm a booking. No payments or customer accounts are included.

Rebuild after changing src/config.js. The historical assets/config.js is no longer used.

## Vercel

Import the repository with the Vite framework preset, `npm run build` as Build Command, and `dist` as Output Directory. These values are set in vercel.json. Deploy only the generated output so archived source and full-resolution originals remain excluded. The six HTML URLs do not need a catch-all rewrite.

The previous hosting attempt did not complete; this React conversion is local and does not deploy.

References: [React effects](https://react.dev/reference/react/useEffect), [Vite multi-page builds](https://vite.dev/guide/build#multi-page-app), [Vercel build settings](https://vercel.com/docs/builds/configure-a-build).

## Verification

The production build and asset checks pass for all six entries, bundled files, ten photo manifest entries, and thirty responsive copies. Browser checks passed for page navigation, lightbox opening/next/Escape, portrait booking preselection, required fields, invalid email, Premium selection, and the unconfigured submission message. The mobile menu and homepage fit were checked at a 390 px viewport override without horizontal overflow. Both legal pages loaded and no errors or warnings appeared in the observed browser log. Real inquiry delivery and hosting deployment remain unconfigured.
