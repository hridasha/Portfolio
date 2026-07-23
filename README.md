# Hridasha Joshi — Portfolio

Static site (plain HTML/CSS/JS, no build step) — deploy it anywhere that serves static files.

## Before you deploy
- Update the GitHub / LinkedIn URLs in `index.html` (search for `github.com/` and `linkedin.com/`, marked with `* update link` notes).
- Swap `assets/Hridasha_Joshi_Resume.pdf` if you update your resume — keep the filename or update the link in `index.html`.

## Deploy — pick one

### GitHub Pages (free, uses this git repo)
1. Create a new empty repo on GitHub (no README/license).
2. `git remote add origin https://github.com/<you>/<repo>.git`
3. `git branch -M main && git push -u origin main`
4. On GitHub: Settings → Pages → Source: `main` branch, `/ (root)` → Save.
5. Live at `https://<you>.github.io/<repo>/` in a minute or two.

### Vercel (free, fastest)
1. Install once: `npm i -g vercel`
2. From this folder: `vercel` → follow prompts → `vercel --prod` for the production URL.
   (No config needed — it auto-detects a static site.)

### Netlify (free, drag-and-drop option)
- CLI: `npm i -g netlify-cli` then `netlify deploy --prod` from this folder.
- No CLI: go to app.netlify.com/drop and drag this whole folder in.

## Local preview
Just open `index.html` in a browser, or run a tiny local server:
```
python -m http.server 5500
```
then visit `http://localhost:5500`.
