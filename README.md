# PALEO ARCHIVE

A bilingual prehistoric-life archive built with static HTML, CSS, and JavaScript.

## Pages

- `index.html`: archive entrance
- `gallery.html`: specimen gallery and locality dossiers
- `timescale.html`: geological timeline
- `form.html`: custom specimen record builder

## Assets

- `assets/images/originals/`: full-resolution source images used by specimen dossiers
- `assets/images/thumbs/`: optimized 960 x 540 WebP card images
- `assets/css/site.css`: shared, page-scoped stylesheet for the entire site
- `assets/js/site.js`: shared JavaScript entry point with page-specific initialization

## Run locally

```powershell
python -m http.server 8000
```

Open `http://127.0.0.1:8000/`.
