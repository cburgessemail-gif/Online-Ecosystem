# Bronson Family Farm Digital Ecosystem — Clean Vercel Project

This is the clean deployable Vite + React project. It does not depend on Tailwind. The ecosystem design is carried by the inline App.tsx styles plus the small CSS reset in src/index.css.

## Exact Vercel settings
- Framework Preset: Vite
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install

## GitHub file placement
Upload these files at the ROOT of the repository, not inside another folder:
- package.json
- index.html
- vite.config.ts
- tsconfig.json
- src/App.tsx
- src/main.tsx
- src/index.css
- public/images/*

## Images
The app expects farm images in public/images with names like GrowArea.jpg, GrowArea2.jpg, SAM_0377.JPG, etc. Placeholder images are included so the app still renders. Replace them with the real farm images using the exact same file names.
