# Naqra landing page

Buildless, bilingual landing page. Serve `dist/` with any static web server. The interactive misbaha is a demonstration; the prayer countdown is explicitly illustrative.

The product showcase embeds Marco De Simone's CC BY 4.0 Sketchfab monitor through the official Viewer API and replaces its screen material with eight real Naqra screenshots (Home, Daily wird, Library and Reminders, each in Arabic and English). Screenshots use demonstration-profile data. Model attribution is displayed below the viewer; full credits are in `dist/assets/CREDITS.txt`.

Desktop visitors get automatic 3D loading when the showcase approaches the viewport. Mobile and reduced-motion visitors see the still monitor preview first and can opt into 3D. The same screen controls work in either mode, with an accessible larger-screenshot dialog. The 3D embed requires Sketchfab availability and WebGL; the still preview and downloads remain usable without it.

The portable app download is copied from the verified Windows release into `dist/assets/Naqra-windows-x64.zip`. No account, analytics, external font service or backend is used by the landing page.

GitHub Pages: publish the contents of `dist/`, or deploy this directory using the included workflow. Sites hosting identity is in `.openai/hosting.json`.
