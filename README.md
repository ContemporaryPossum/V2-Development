# V2 Development website

A single-page, static website for V2 Development Sdn. Bhd. No build step, no framework, no server code. Every file sits in one flat folder.

## Deploy: GitHub, then Cloudflare Pages

1. Create a new GitHub repository (for example `v2-development-website`).
2. Upload every file in this folder to the root of the repository. Use **Add file → Upload files** and drag them all in at once. Keep `_headers`: it carries the security headers.
3. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** and pick the repository.
4. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
5. Deploy. To use the real domain, add `v2-d.com` under **Custom domains** once the client is ready to switch from the old WordPress site.

The site's canonical URL, sitemap and social-sharing image point to `https://v2-d.com/`. If it will live on another domain, update those URLs in `index.html`, `robots.txt` and `sitemap.xml`.

## What is in the folder

| File | Purpose |
| --- | --- |
| `index.html` | The page |
| `styles.css` | All styling (design tokens at the top) |
| `main.js` | Smooth scroll, scroll scenes, background film, badge morph, charts, enquiry form. Project and land data live at the top of this file |
| `gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js` | GSAP 3.15.0 (free for commercial use under GreenSock's standard licence) |
| `lenis.min.js` | Lenis 1.3.26 smooth scroll (MIT) |
| `bg-landscape.mp4`, `bg-portrait.mp4`, `poster-*.webp` | The background film (generated with Higgsfield), encoded for smooth scroll scrubbing |
| `badge-*.webp` | The four achievement badges, turned into transparent gold masks |
| `proj-*.webp`, `progress-*.webp` | Project renders and site photos from v2-d.com |
| `emblem-*.png`, `logo-colour.png`, `favicon.png`, `apple-touch-icon.png` | Brand marks |
| `_headers` | Cloudflare Pages security headers (CSP, HSTS, framing, referrer) and caching |
| `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `og-image.jpg` | Housekeeping and SEO |

## Updating content

- **Projects, prices, specs:** edit the `PROJECTS` list near the top of `main.js`. Add a new photo to the folder and point `img` at it.
- **Upcoming land:** edit the `UPCOMING` list in `main.js`. The lot plans redraw themselves from the unit count and lot depth.
- **Charts:** the figures are in the `CHARTS` section of `main.js`. They were totalled from the October 2026 listings. Update them when projects change.
- **Site progress:** edit the cards in the `progress` section of `index.html`.
- **Enquiries:** the form sends to WhatsApp `+60 12-684 1812` or to `marketing@v2-d.com.my`. Change both in `enquiryForm()` in `main.js`.

## Things to confirm with the client before launch

- That 012-684 1812 is the right WhatsApp number for enquiries.
- Current prices, especially Taman Dato Harun 5, Tok Muda Berjaya, Khalid Al-Walid 3 and Imam Yusof 5, which are listed without prices.
- Whether the five upcoming parcels are still upcoming. Some may now be the current Dato Harun 5 and Dato Ahmad Razali 2 projects.
- That the `includeSubDomains` part of HSTS in `_headers` is fine. Every subdomain of the site's domain must support HTTPS.
