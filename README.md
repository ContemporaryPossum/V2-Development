# V2 Development — website

Static, single-page site for V2 Development Sdn. Bhd. Every file sits at the top level (no folders), so you can drag the whole set into a GitHub repository and deploy it on Cloudflare Pages without a build step.

## Deploy

1. Create a GitHub repository and upload **all files in this folder** to its root (drag and drop works; the largest file is about 5 MB).
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repository.
3. Build settings: Framework preset **None**, build command **empty**, build output directory **`/`**.
4. Deploy. After you connect the final domain, update the `canonical` and `og:image` URLs at the top of `index.html` if the domain isn't `v2-d.com`.

`_headers` is read by Cloudflare Pages (security headers plus 7-day caching for images and the film).

## What each file does

| File | Purpose |
| --- | --- |
| `index.html` | All page content, SEO tags, and the chart data (`<script id="v2-chart-data">`) |
| `styles.css` | Design tokens, dark/ivory theme flip, layouts, responsive rules |
| `main.js` | Lenis smooth scroll + GSAP ScrollTrigger scenes, intro, scroll-scrubbed film, project drawer data (`PROJECTS`), enquiry form |
| `v2-charts.js` / `v2-charts.css` | Prebuilt Bklit UI charts (React + Visx + Motion), lazy-loaded when the Track record section approaches |
| `v2-film.mp4` / `v2-film-poster.jpg` | Background film scrubbed by scroll, made from V2's own renders and drone photography |
| `*.webp` | Project renders and site-progress photos (from v2-d.com) |
| `favicon.svg`, `og-image.jpg` | Browser icon (vector trace of the V2 mark) and social share image |

Libraries load from jsDelivr at pinned versions: GSAP 3.15.0 (ScrollTrigger, SplitText) and Lenis 1.3.26. Fonts: Cormorant Garamond, Hanken Grotesk and DM Mono (Google Fonts).

## Editing content

- **Project details / prices (drawer):** `PROJECTS` near the top of `main.js`. Add `permit: "…"` to a project to show its developer licence / advertising permit line.
- **Project cards:** the `<article class="pcard">` blocks in `index.html`.
- **Charts:** edit the JSON in `<script id="v2-chart-data">` in `index.html`; no rebuild needed.
- **WhatsApp / email for the form:** `WHATSAPP` and `EMAIL` constants in `main.js`.
- **Replacing the film:** keep the filename `v2-film.mp4`, H.264, about 16 s, with a short keyframe interval (for example `ffmpeg -i in.mp4 -an -c:v libx264 -g 8 -crf 28 -vf scale=1280:-2 v2-film.mp4`) so scroll-scrubbing stays smooth. If the shot timings change, update the time ranges passed to `filmWindow(...)` and the `cuts` array in `main.js`.

## Check with the client before launch

These came up while compiling the content from v2-d.com, Google Maps and listing portals:

1. **Developer licence and advertising & sales permit numbers** aren't published on the current site. Malaysian property advertising normally needs them, so add them per project.
2. **WhatsApp:** the form sends WhatsApp messages to 012-684 1812 (Marketing 1). Confirm this number uses WhatsApp.
3. **Completion years:** Khalid Al-Walid 3 and Imam Yusof 5 are listed as 2024, but Khalid Al-Walid 3 site photos run to February 2026.
4. **Desa Bukit Permata price:** the listing says RM681,000; the floor-plan widget shows RM618,000.
5. **Taman Harmoni postcode:** the site shows both 45950 and 43950. This site uses 43950 (Sungai Pelek).
6. **Office hours:** the website says 9am–5pm; Google Maps says it closes at 5:30pm.
7. **Testimonials** are short excerpts from public Google reviews (4.9★, 61 reviews). Confirm the client is happy to feature them.
8. **Upcoming launches:** Lot 1996 (Meru Permai), PT 158664 (Dato Ahmad Razali 2) and PT 158640 (likely Dato Harun 5) were left out because they appear to be live projects already. The 135 upcoming homes shown cover Lot 14835, Lot 114122 and Lot 114120.
9. **Social media:** no Facebook or Instagram pages could be found. Add links in the footer if they exist.
10. **Name spelling:** "Taman Tok Muda Sejahera" on the current site is written as "Sejahtera" here.

## Credits and licences

GSAP is free under GreenSock's standard license. Lenis and Bklit UI are MIT. The fonts are under the SIL Open Font License. All photography and renders belong to V2 Development; renders are labelled as artist's impressions.
