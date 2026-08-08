# Akash P T — Portfolio

Plain HTML / CSS / vanilla JS, no build step, no frameworks.

## Structure
```
index.html
styles.css
script.js
assets/
  favicon.svg
  placeholder-project.svg   ← swap for real project screenshots (same filename, or update the <img> src in index.html)
```

## To personalize
- Replace project screenshots: drop real images into `assets/` and update the `src` on each `.project-card__media img` in `index.html`.
- Add your real resume as `assets/Akash-PT-Resume.pdf` (the Resume buttons link to that path).
- Add `assets/og-cover.png` (1200×630) for social share previews, or remove the `og:image` tag.
- Swap the placeholder email/GitHub/LinkedIn links in the hero, contact section, and footer.
- Project, experience, and skills content is realistic placeholder copy — edit directly in `index.html`.

## Notes
- The contact form is frontend-only validation; wire the `submit` handler in `script.js` to your backend/API or a service like Formspree when ready.
- Colors, type scale, and spacing are all CSS variables at the top of `styles.css` (`:root`) if you want to retune anything globally.
- Respects `prefers-reduced-motion`.
