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

### Improving algorithms that were already short

The gains are not limited to long algorithms. Of the 104 published solutions
that were already **20 BTM or shorter**, 30 were improved (28.8%), removing 64
moves from that improved subset. Some particularly compact examples are:

| Pattern | Code | Previous | New | Saving |
| --- | --- | ---: | ---: | ---: |
| 3 Bricks (cw / ccw) | `N600.01–02` | 11 BTM | **10 BTM** | 1 |
| 5 Ties (±144°) | `I680.03–04` | 16 BTM | **14 BTM** | 2 |
| 5 C's (±144°) | `A430.03–04` | 18 BTM | **14 BTM** | 4 |
| Color Windmill | `N480.03–04` | 18 BTM | **15 BTM** | 3 |
| Equator Bricks (±144°) | `I630.03–04`, `I630.07–08` | 20 BTM | **17 BTM** | 3 |

The two 10-move Bricks solutions are especially notable: their previous
algorithms were only 11 BTM, leaving very little obvious room for improvement.

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

The complete collection is available as a machine-readable JSON dataset:
**[`public/patterns.json`](public/patterns.json)**. It contains all 334 patterns
and can be viewed directly, downloaded, or reused in other Megaminx tools.

Each record includes:

- the pattern name and unique catalogue code;
- the previous published algorithm, length, author, and publication date;
- the new personal-best algorithm and its BTM length;
- a separate FTM-focused solution and length;
- ready-to-open Alpha Twizzle links for all solution variants;
- a Twizzle-compatible version of the legacy published algorithm used by the
  interactive preview.

The website loads this JSON file directly, so the interface and the downloadable
dataset always describe the same collection. The original input data is kept in
**[`data/patterns-source.json`](data/patterns-source.json)** for provenance.

The `code` field controls navigation: its first letter identifies the section
and its first four characters identify the pattern group. Individual pages are
linkable with the `?pattern=A200.01` URL parameter.

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
