# Improved Megaminx Patterns

A collection of **334 Megaminx patterns**, revisited one by one to find shorter
algorithms. The catalogue compares each result with the previously published
algorithm and includes an interactive Alpha Twizzle preview, a personal best,
and a personal FTM-optimised solution.

**[Open the interactive Megaminx Patterns catalogue](https://ananasclassic.github.io/improved_megaminx_patterns/)**

## Results

| | Result |
| --- | ---: |
| Patterns improved | **218 / 334 (65.3%)** |
| Patterns tied | 76 / 334 (22.8%) |
| Patterns not improved | 40 / 334 (12.0%) |
| Total catalogue length | **10,250 → 8,801 BTM** |
| Net moves saved | **1,449 BTM (14.1%)** |
| Median saving among improved patterns | **6 BTM** |
| Average saving among improved patterns | **7.9 BTM** |

In other words, almost two out of every three published algorithms were made
shorter. The improved subset alone accounts for 1,727 saved moves before the
longer and tied results are included in the catalogue-wide net figure.

### Improvement histogram

Distribution of the **218 improved patterns** by the number of BTM moves saved:

```text
Moves saved   Patterns
 1–2          ████████████             35
 3–5          ████████████████████████ 72
 6–10         ██████████████████       53
11–20         ██████████████           41
21+           ██████                   17
```

### Highlights

- **4 Propellers** (`N500.03` and `N500.04`) has the largest absolute
  improvement: **58 → 25 BTM**, saving 33 moves (56.9%).
- **Superfliptwist** (`V500.01`) drops from **76 → 44 BTM**, saving 32 moves.
- **4 Stars** (`A850.02`) is exactly half as long: **50 → 25 BTM**.
- 48 of the 62 Simple Patterns were improved (**77.4%**).
- For 79 patterns, the personal best and the FTM-focused solution are the same
  algorithm after whitespace normalisation.

The statistics above are calculated from `public/patterns.json`. “Improved”
means that `new_solution_length` is lower than `old_solution_length`; aggregate
figures use the BTM lengths stored in those fields.

## Explore the catalogue

Each pattern page provides the old published algorithm alongside the new
solutions, a live 3D Megaminx, direct Alpha Twizzle editor links, search, and
navigation through the complete collection. Individual patterns can be linked
with a query such as `?pattern=A200.01`.

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
