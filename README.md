# Megaminx Patterns

A static, searchable catalogue of Megaminx patterns. Each page combines a live
Twizzle preview with the previous published best, a personal best, and a
personal FTM-optimised solution.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL in the terminal. A production build is created with:

```bash
npm run build
npm run preview
```

The generated `dist/` directory uses relative asset URLs, so it can be deployed
at a domain root or a subdirectory such as a GitHub Pages project site.

## Free hosting with GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`, which tests,
builds, and publishes the site after every push to `main`.

1. Create a new **public** repository on GitHub.
2. Unpack this project and push all files to the repository's `main` branch.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. Open the **Actions** tab and wait for “Deploy to GitHub Pages” to finish.

GitHub will show the public URL in the completed deployment and under
**Settings → Pages**. A custom domain can be attached there later.

If you do not want to use Git, run `npm run build` and upload the contents of
`dist/` to a static host such as Netlify or Cloudflare Pages.

## Data

The catalogue is loaded from `public/patterns.json`; the original supplied data
is retained in `data/patterns-source.json`. The `code` field controls
navigation: its first letter identifies the section and its first four
characters identify the pattern group. Individual pages are linkable with the
`?pattern=A200.01` URL parameter.

If `new_solution` and `minimal_ftm_solution` are identical after whitespace is
normalised, the interface displays one combined personal-solution block.

The original Randelshofer algorithms use a legacy notation that Alpha Twizzle
cannot always parse. `npm run refresh-data` rebuilds `public/patterns.json` from
the source JSON and enriches each record with the Twizzle-compatible preview
algorithm published on its matching Randelshofer page.

## Checks

```bash
npm test
```

The tests verify catalogue integrity, Twizzle links, comparison states, and all
1,002 Megaminx algorithms used by the three solution types.
