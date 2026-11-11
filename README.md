# Naqra landing page

Buildless, bilingual landing page. Serve `dist/` with any static web server. The interactive misbaha is a demonstration; the prayer countdown is explicitly illustrative.

The main download is the verified Windows MSI installer at `dist/assets/Naqra-windows-x64.msi`. The portable ZIP remains available at `dist/assets/Naqra-windows-x64.zip`. No account, analytics, external font service or backend is used by the landing page.

GitHub Pages: publish the contents of `dist/`, or deploy this directory using the included workflow. Sites hosting identity is in `.openai/hosting.json`.

## Editing the landing page

The complete publishable site remains in `dist/`. After editing the CSS source files or `dist/app.js`, run `node scripts/build.mjs` from this directory. It combines the ordered stylesheets into `dist/site.css` and updates content hashes in the HTML so visitors receive the matching styles and script. No package installation is needed. Commit the generated bundle with its sources.
