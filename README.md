# Eayon — Between idea & reality

A bilingual editorial portfolio for 田一雄 / Eayon, digital product manager.

**Website:** https://eayon199464-hub.github.io/eayon-editorial-portfolio/

This edition has its own repository and Pages address. It does not replace the earlier `tian-yixiong-resume-h5` website.

## The issue

An independent cover opens into three thematic chapters:

1. Idea — BMW JOYCUBE
2. Practice — VOYAH Sales Assistant
3. Beyond — LATAM CRM

The sequence is editorial, not chronological. INDEX includes all six career entries. ABOUT contains the personal principle “如无必要，勿增实体。”, contact details, and the existing Chinese CV download.

Page turns support buttons, keyboard navigation and image dragging. Chinese/English and reduced-motion preferences are remembered locally. Mobile stories use natural vertical reading.

## Images and project credits

Paper/acetate still-life images are editorial artwork, not photographs documenting the projects. JOYCUBE project photographs come from [BLACKBOW's published case on D-arts](https://www.d-arts.cn/project/project_info/key/MTIwMjIwNzM2NTGDz31jr5y4cw.html); the original images and watermarks are preserved. Related sources remain in the story's further-reading section.

The ADC shortlist credits BLACKBOW / Beijing + interone / Beijing. Public project context and team recognition are distinct from Eayon's self-reported contributions. Source publication does not establish a commercial-use license; third-party photographs are not offered under an open-source license by this repository.

## Development

```sh
npm ci
npm run dev
npm run build
npm test
```

The production browser files are in `dist/client`. Relative asset URLs support deployment under this repository's GitHub Pages path. The existing Sites-compatible worker output remains in `dist/server` and `dist/.openai`.

## Publishing

- `main`: editable source and selected website assets.
- `gh-pages`: built contents of `dist/client`, plus `.nojekyll`.
- GitHub Pages: branch `gh-pages`, root directory `/`.

Publishing is deliberately separate from the older website. Do not push this edition to `tian-yixiong-resume-h5`.

Typography: Bodoni Moda and Inter (OFL). Icons: Phosphor (MIT). Animation: Motion (MIT).
