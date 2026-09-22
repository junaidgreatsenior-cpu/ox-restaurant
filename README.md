# OX Restaurant & Lounge — responsive premium restaurant website

A restaurant-first, multi-page static website for OX Restaurant & Lounge, Victoria Island, Lagos.

## Included pages
- `index.html` — cinematic home, story, signature dishes, visual gallery, testimonials, reservations and location.
- `menu.html` — dedicated food menu with category filtering, search and all 67 named food dishes currently exposed with prices on OX's public food-menu page.
- `order.html` — food order-request builder with quantities, live total, Web3Forms submission and a WhatsApp handoff.
- `reserve.html` — reservation request page with Web3Forms and WhatsApp handoff.

## Responsive / UX QA pass
The latest version includes a dedicated spacing and overflow pass for desktop, tablet and phone sizes:
- no intentional horizontal page overflow
- mobile-first typography and spacing
- safe-area support for modern phones
- sticky mobile Menu / Reserve actions
- swipeable menu category rails
- stacked mobile food/menu cards with clear price placement
- mobile-safe gallery/card heights
- full-screen, scrollable mobile navigation
- body scroll lock while the mobile menu is open
- Escape/veil/mobile-link close behavior
- accessible focus states
- reduced-motion support
- theme preference persistence
- smoother hover/glow treatment on capable desktop devices

## Web3Forms
Put the real Web3Forms access key in `config.js`:

```js
window.OX_CONFIG={
  web3AccessKey:'YOUR_ACCESS_KEY_HERE'
};
```

The forms post to the documented Web3Forms endpoint.

## Media
The build retains the six publicly surfaced OX image URLs already used in the project as visual references. For a commercial launch, swap these for OX-approved/licensed originals. Direct social-feed video files were not reliably retrievable in the current public fetch, so the site links to OX's Instagram rather than republishing unverified video files.

## Deploy to Vercel
This is a plain static site and needs no build command.

1. Upload the `ox-restaurant-site` folder to Vercel.
2. Set the project root to the folder containing `index.html`.
3. No framework preset or build command is required.

`vercel.json` is included with clean URLs enabled.
