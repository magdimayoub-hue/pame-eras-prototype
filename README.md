# PAME ERAS Society website

Website of the Pan African & Middle East ERAS Society, built with [Eleventy](https://www.11ty.dev/) and published on GitHub Pages.

## Where things live

| Path | What it holds |
|---|---|
| `src/_data/site.json` | Society name, menu, footer links, legal notice, prototype banner |
| `src/_data/events.json` | Event archive (one entry per event; `cover` is the photo number used on cards) |
| `src/_data/videos.json` | Video library (YouTube IDs and titles) |
| `src/_data/guidelines.json` | Guidelines library entries and categories |
| `src/*.njk` | One file per page; each page's own styles, content and scripts |
| `src/_includes/` | Shared layout, header and footer |
| `src/assets/` | Stylesheet, scripts, logos |
| `src/img/events/<event-id>/` | Event photos, numbered `1.jpg`, `2.jpg`… |

`assets/data.js` is generated from the JSON files at build time; edit the JSON, not the output.

## Build and preview

```
npm install
npm start          # preview at http://localhost:8080
npm run build      # writes the finished site to _site/
```

## Publishing

Every pull request is built by GitHub Actions to check it works. Merging into `main` builds the site and publishes it to GitHub Pages (Pages source: GitHub Actions).
