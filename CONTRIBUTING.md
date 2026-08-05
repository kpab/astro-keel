# Contributing to Astro Keel

Thanks for your interest in improving the theme. Bug reports, docs fixes, and
focused pull requests are all welcome.

## Design principles

Astro Keel is a **minimal** theme, and staying minimal is a feature. Two rules
follow from that:

1. **Ship zero client-side JavaScript by default.** Anything that adds runtime
   weight (comment widgets, analytics, animation libraries) must be opt-in via a
   flag in `src/consts.ts` and emit nothing when disabled.
2. **Configuration lives in one place.** New knobs go in `src/consts.ts` with a
   doc comment, not scattered across templates. A user should be able to rebrand
   the theme without editing `.astro` files.

## Development setup

Requires **Node.js 22.12 or newer** (Astro 7). The release line CI builds on
lives in `.nvmrc`, so a version manager can pick it up for you — `nvm use`,
`fnm use`, or `mise install` in the project root.

```sh
git clone https://github.com/kpab/astro-keel.git
cd astro-keel
nvm use          # or `fnm use` / `mise install` — reads .nvmrc
npm install
npm run dev      # dev server at http://localhost:4321/astro-keel/
```

Note the `/astro-keel/` path — `astro.config.mjs` sets `base` for the GitHub
Pages demo. Leave it as-is in PRs; downstream users drop it for a root domain.

Before pushing:

```sh
npm run check    # astro check — must report 0 errors
npm run build    # must succeed; also runs `pagefind` via postbuild
```

`npm run check` currently emits four hints: two Zod deprecations from Astro's
content schema API, and two unused-`Props` hints in the paginated routes. Those
are pre-existing — new *errors* are not acceptable, new hints should be avoided.

## Project structure

```
src/
  consts.ts          # site identity, nav, social links, feature flags
  content.config.ts  # collection schemas (Content Layer API)
  content/           # works/ and blog/ Markdown & MDX entries
  layouts/           # BaseLayout — head, nav, theme toggle, footer
  components/        # Pagination, SocialLinks, CodeCopy, StructuredData…
  pages/             # routes: /, /about, /works, /blog, tags, search, rss.xml
  lib/url.ts         # withBase() — always use it for internal links/assets
  styles/global.css  # design tokens (OKLCH), typography, layout primitives
astro.config.mjs     # site URL, base path, integrations, Shiki config
```

Two things that trip people up:

- **Always route internal links through `withBase()`** (`src/lib/url.ts`).
  Hard-coded `/blog/` links break every deployment that uses a `base` path.
- **The theme uses View Transitions** (`<ClientRouter />`). Scripts that touch
  the DOM must re-run after soft navigation — listen for `astro:page-load` or
  `astro:after-swap` rather than relying on a single initial execution.

## Pull requests

- Branch from `main`. Use a descriptive branch name (`feat/…`, `fix/…`, `docs/…`).
- **Keep commits small** — one logical change per commit.
- Commit subjects follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `chore:`).
- Include **light and dark mode screenshots** for any visual change.
- One concern per PR. Unrelated drive-by refactors make review slow.
- Add an entry under `## [Unreleased]` in [CHANGELOG.md](./CHANGELOG.md) for
  user-visible changes.

## Reporting bugs

Open an issue with the **Bug report** form. A reproduction — even just the exact
frontmatter and the build output — resolves reports far faster than a
description alone.

## Release procedure

Maintainers only.

1. Move the `## [Unreleased]` entries in `CHANGELOG.md` into a new
   `## [x.y.z] - YYYY-MM-DD` section and update the link definitions at the
   bottom of the file.
2. Bump `version` in `package.json` to match.
3. Commit as `chore: release vx.y.z`, then tag and push:

   ```sh
   git tag vx.y.z
   git push origin main --tags
   ```

4. Publish the GitHub Release, using that changelog section as the body — paste
   it in and close with `Ctrl-D`:

   ```sh
   gh release create vx.y.z --title "vx.y.z" --notes-file -
   ```

The Lighthouse table in the README is a hand-recorded snapshot, not a live
badge — re-run it before cutting a release so a regression can't sit behind a
stale 100:

```sh
npm run build && npm run preview
npx lighthouse http://localhost:4321/astro-keel/ --preset=desktop --view
```

Versioning is [Semantic Versioning](https://semver.org/): a breaking change to
`src/consts.ts`, the content schemas, or the required Node version bumps the
major (or the minor, while the theme is pre-1.0).

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
