# V2 Development — Website

A static website for V2 Development Sdn. Bhd. Plain HTML, CSS and JavaScript, with no build step.
Every file sits in the root folder, so you can upload them to GitHub as they are.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home page: preloader, hero, the collection, locations, site progress, partners |
| `residences.html` | The Collection: every residence with filters, plus upcoming launches |
| `residence.html` | One template for every residence, e.g. `residence.html?p=taman-harmoni` |
| `about.html` | Story, vision, mission, core business, company details |
| `progress.html` | Construction photographs for each active site |
| `partners.html` | Landowners & joint ventures, with a proposal form |
| `contact.html` | Office details, map and enquiry form |
| `404.html` | Page-not-found page (Cloudflare Pages uses it automatically) |
| `data.js` | **All content lives here:** company details, residences, prices, photos |
| `main.js` | Shared header, menu, footer, forms, gallery and animations |
| `styles.css` | All styling. Colours and fonts are set at the top in `:root` |
| `favicon.svg`, `robots.txt`, `sitemap.xml`, `_headers` | Icon, SEO files and Cloudflare security headers |

## Deploy

1. **GitHub:** create a new repository, choose *Add file → Upload files*, drag in every file, and commit.
2. **Cloudflare:** go to *Workers & Pages → Create → Pages → Connect to Git* and pick the repository.
   - Framework preset: **None**
   - Build command: *leave empty*
   - Build output directory: **/**
3. Add your custom domain under the project's *Custom domains* tab.

Each push to GitHub redeploys the site automatically.

## Editing content

- **Phone, email, WhatsApp, address, Facebook:** edit `V2_SITE` at the top of `data.js`.
- **Residences and prices:** edit `V2_PROJECTS` in `data.js`. A new entry appears on the home page, the collection and its own detail page.
- **Site progress photos:** add image paths to `V2_PROGRESS` in `data.js` and update the `updated` date.
- **Domain:** if the site will not live at `v2-d.com`, replace that address in `sitemap.xml`, `robots.txt` and the `canonical` and `og:` tags at the top of each page.

## Images

All 155 photos are included in the root folder (about 39 MB in total), resized and compressed for the web.
The site no longer depends on the old WordPress site, so it is safe to switch the domain over.

File names follow one pattern, which `data.js` uses:

| Pattern | Used for |
| --- | --- |
| `harmoni-01.jpg`, `harmoni-02.jpg` … | Gallery images for a residence |
| `harmoni-plan-01.jpg` … | Floor and layout plans |
| `progress-harmoni-01.jpg` … | Site-progress photographs |
| `about-*.jpg` | About page images |

To add a photo, upload it with the next number (for example `progress-harmoni-22.jpg`) and raise the count in `data.js`
(`photos('progress-harmoni', 21)` becomes `photos('progress-harmoni', 22)`). Keep new photos under about 2000px wide and 500 KB.

## Forms

There is no server. The enquiry and partner forms build a ready-to-send message and open WhatsApp (012-684 1812) or the visitor's email app (marketing@v2-d.com.my).
To collect submissions in an inbox or spreadsheet instead, connect a form service such as Formspree or a Cloudflare Worker.
