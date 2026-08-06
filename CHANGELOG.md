# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Because Astro Keel is a **template**, "upgrading" usually means porting the
changes below into your own copy rather than bumping a dependency. Entries are
written with that in mind — each one names the files it touches.

## [Unreleased]

### Added

- **Prettier** with `prettier-plugin-astro` (`.prettierrc`, `.prettierignore`),
  plus `npm run format` / `npm run format:check` and a formatting gate in CI.
  Settings match the existing code — single quotes, 100-column lines — so
  porting this into your own copy reflows rather than rewrites it.
  `src/components/Comments.astro` is excluded: the plugin cannot parse its
  expression-wrapped `<style>`.
- **`.editorconfig`** covering charset, line endings, and indentation for
  editors that do not run Prettier.
- **`.github/workflows/release.yml`** — pushing a `vX.Y.Z` tag now extracts
  that version's section from `CHANGELOG.md` and publishes it as the GitHub
  Release body automatically, replacing the manual `gh release create` step.
  The workflow fails loudly if the tag has no matching CHANGELOG section.

### Changed

- The tree is now Prettier-formatted. No behaviour changed — the diff is quote
  style, wrapping, and Markdown emphasis syntax.

## [0.2.0] - 2026-08-03

### Added

- **Static search** at `/search`, powered by [Pagefind](https://pagefind.app/)
  and indexed at build time via a `postbuild` script — zero backend.
- **Pagination** on the blog index and tag archives, 10 posts per page
  (`src/components/Pagination.astro`).
- **Auto-generated Open Graph images** for every post and work, rendered at
  build time with `satori` + `sharp` (`src/pages/og/[collection]/[slug].png.ts`).
- **Reading time** on blog posts, via a `remark` plugin (`remark-reading-time.mjs`).
- **View Transitions** — `<ClientRouter />` for soft navigation between pages,
  with the theme toggle, Pagefind, and code-copy buttons re-initialized on
  `astro:page-load` / `astro:after-swap`.
- **JSON-LD structured data** — `WebSite` on the home page, `BlogPosting` +
  `BreadcrumbList` on posts (`src/components/StructuredData.astro`). The author
  is configurable through `SITE.author`.
- **Copy buttons on code blocks** (`src/components/CodeCopy.astro`).
- **Previous / next post navigation** at the end of each blog post.
- **Related posts** section, matched on shared tags.
- **Configurable social links** in the footer — declare them in `SOCIAL_LINKS`
  in `src/consts.ts` and they render as inline SVG icons
  (`src/components/SocialLinks.astro`).
- **Custom 404 page** (`src/pages/404.astro`).
- Sticky top bar on scroll.
- Community health files — issue forms, a pull request template,
  `CONTRIBUTING.md`, and this changelog.
- **Localizable UI strings.** Every string the theme itself renders now comes
  from a typed dictionary in `src/i18n/`, selected by a new `SITE.locale`.
  One line also drives `<html lang>`, `og:locale`, `Intl` date formatting, and
  the RSS `<language>` element. `en` and `ja` ship with the theme; the
  dictionary covers UI chrome only, so the placeholder prose on the home and
  about pages stays in those `.astro` files. Nav entries take a `labelKey`
  (dictionary) or a literal `label`, and the type requires exactly one.
- **Optional Giscus comments** on blog posts, configured through `GISCUS` in
  `src/consts.ts` and **off by default** — a disabled build emits no Giscus
  markup, styles, or script at all. When enabled, the widget loads only once the
  reader scrolls near it, follows the light/dark toggle live, and falls back to
  a GitHub Discussions link if the embed never appears
  (`src/components/Comments.astro`).
- Default Open Graph image (`public/og.jpg`), work thumbnails, and a hero image
  for the sample posts.

### Changed

- **`minutesRead` is now a number**, not a preformatted `"3 min read"` string.
  `reading-time`'s own text is hard-coded English and would have survived every
  `SITE.locale` change; templates render it through the `readingTime()` helper
  in `src/i18n/` instead. If you read `remarkPluginFrontmatter.minutesRead` in a
  template of your own, route it through that helper too — it tolerates either
  shape.

  The Content Layer keeps rendered frontmatter in
  `node_modules/.astro/data-store.json`, and changing a remark plugin does not
  invalidate it, so the first build after upgrading may still serve the old
  value. Delete `node_modules/.astro/` once — clearing the repo-root `.astro/`
  is *not* enough, it only holds generated types. The helper degrades
  gracefully in the meantime (you would otherwise see `3 min read min read`
  after upgrading, or a bare `3` after downgrading).
- Site identity (title, description, RSS description, share image, author,
  footer text, nav items) is centralized in `src/consts.ts`.
- README rewritten: badge header, light/dark preview screenshots, and expanded
  configuration and deployment sections.
- Content images recompressed to JPEG for lighter social sharing.
- Section spacing tightened so the hero and its call to action fit a laptop
  viewport.

### Fixed

- Theme toggle now sits at the right edge of the first row on mobile.
- Section padding no longer showed the divider background behind the works list
  and the about ledger.
- Hero heading size capped so the call to action stays above the fold.
- Filled `.button` text now uses a per-scheme `--color-on-accent` token. The
  dark-scheme accent is light, so near-white label text only reached a 2.53:1
  contrast ratio; the dark demo page now passes WCAG AA and Lighthouse
  accessibility scores 100.

## [0.1.0] - 2026-06-27

Initial release.

### Added

- Astro 7 project with MDX, `@astrojs/sitemap`, and `@astrojs/rss`.
- `works` and `blog` content collections on the Content Layer API, with listing
  and detail pages for each.
- Per-tag blog archives at `/blog/tags/[tag]`.
- RSS feed at `/rss.xml`.
- Structural-minimalist design system: OKLCH theme tokens, a single
  `--color-accent` variable, and self-hosted Fraunces / Public Sans /
  JetBrains Mono via `@fontsource`.
- Light and dark mode honoring `prefers-color-scheme`, with a header toggle
  persisted to `localStorage` and no flash on load.
- Shiki dual themes emitted as CSS variables so highlighting follows the active
  color scheme.
- Canonical URLs, Open Graph, and Twitter card meta in the base layout.
- Base-path-aware internal links through `withBase()` (`src/lib/url.ts`).
- GitHub Pages deployment workflow (`.github/workflows/deploy.yml`), building on
  Node 22.
- `npm run check` (`astro check`) wired up, MIT license, and the theme README.

[Unreleased]: https://github.com/kpab/astro-keel/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/kpab/astro-keel/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kpab/astro-keel/releases/tag/v0.1.0
