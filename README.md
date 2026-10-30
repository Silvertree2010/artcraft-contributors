# ArtCraft Contributors

Contributor stats for the ArtCraft Craft app bundle: https://artcraft.apollonet.dev

Node 22, no dependencies. The server syncs pull requests, reviews, commits, issues and stargazers of the Craft repos via the GitHub GraphQL API, release downloads and Actions runs via REST, Homebrew cask analytics, SonarCloud measures and aggregate message counts for an allowlist of public Discord channels (from a separate read-only bridge, never message text or names), and serves precomputed stats plus a static frontend with hand-drawn SVG charts. Extras: per-app pages, releases, weekly recap, comparisons, an RSS feed (`/feed.xml`), README badges (`/badge/u/<login>.svg`, `/badge/app/<repo>.svg`) and Open Graph tags on `/u/`, `/app/`, `/vs/`, `/releases`, `/week`.

GitHub sign-in is optional and asks for no scopes. The access token lives only in an encrypted HttpOnly cookie; the server stores nothing about signed-in users.

## Run

```sh
GH_TOKEN=... node server.mjs
```

Sign-in additionally needs `OAUTH_ID`, `OAUTH_SECRET` and `BASE_URL`. Secrets can also be mounted as files in `/run/secrets/` (`gh_token`, `oauth_id`, `oauth_secret`).

| Env | Default |
| --- | --- |
| `PORT` | `8080` |
| `DATA` | `./data` |
| `WEB` | `./web` |
| `BASE_URL` | `http://localhost:8080` |

## Docker

```sh
docker compose up -d --build
```

Fonts: Archivo, Inter and Geist Mono under the SIL Open Font License (see `web/fonts`).
