"""Check local HTML links, anchors, responsive images, and manifest coverage."""
raise SystemExit('This project now uses React. Run npm run build followed by npm run check instead.')
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json

root = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.file, self.refs, self.ids, self.images = file, [], set(), []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        for key in ['href', 'src', 'data-photo']:
            if a.get(key): self.refs.append(a[key])
        if 'srcset' in a:
            self.refs.extend(s.strip().split()[0] for s in a['srcset'].split(','))
        if tag == 'img' and a.get('src'): self.images.append(a)

pages = {}
for file in root.glob('*.html'):
    page = Page(file)
    page.feed(file.read_text(encoding='utf-8'))
    pages[file.name] = page
errors = []
for page in pages.values():
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        target = root / unquote(url.path) if url.path else page.file
        if not target.exists(): errors.append(f'{page.file.name}: missing {ref}')
        if url.fragment and target.suffix == '.html' and target.name in pages and url.fragment not in pages[target.name].ids:
            errors.append(f'{page.file.name}: missing anchor {ref}')
    for image in page.images:
        if not all(image.get(k) for k in ['alt', 'width', 'height']): errors.append(f'{page.file.name}: image metadata missing')
data = json.loads((root / 'data/site.json').read_text())
for item in data['photos']:
    if not (root / 'images' / item['file']).exists(): errors.append(f'Missing original {item["file"]}')
    gallery = pages['cars.html' if item['category']=='automotive' else 'portraits.html']
    if not any(Path(item['file']).stem in r for r in gallery.refs): errors.append(f'Photo not in gallery: {item["file"]}')
assert not errors, '\n'.join(errors)
print(f'PASS: {len(pages)} pages, all local links/anchors/image variants, image metadata, and {len(data["photos"])} gallery photographs.')
