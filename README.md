# ArtCraft Contributors

Contributor stats for the ArtCraft Craft App Bundle: https://artcraft.apollonet.dev

Node 22, no dependencies. The server syncs pull requests, reviews, commits, issues and stargazers of the Craft repos (plus community apps listed in the launcher catalog) via the GitHub GraphQL API, release downloads and Actions runs via REST, Homebrew cask analytics and SonarCloud measures. It serves precomputed stats and a static frontend with hand-drawn SVG charts.

## Features

- Overview with KPIs, merges per day, where work lands, downloads per platform, a 24-hour activity clock, an app treemap and open issues
- Source toggle: all apps, Storytold only, or 3rd-party community apps
- Leaderboard with merged PRs, commits, reviews, merge rate, reverts and each contributor's share of merged PRs, for the whole bundle or a single app
- Per-app pages, releases, a weekly recap, profile pages with activity calendar and streaks, head-to-head comparisons
- RSS feed (`/feed.xml`), README badges (`/badge/u/<login>.svg`, `/badge/app/<repo>.svg`, `/badge/card/<login>.svg`) and Open Graph tags on `/u/`, `/app/`, `/vs/`, `/releases`, `/week`

GitHub sign-in is optional and asks for no scopes. The access token lives only in an encrypted HttpOnly cookie; the server stores nothing about signed-in users.

## Discord activity

The Discord numbers on the overview (messages per day, active people, busiest channels) come from a separate service that is not part of this repo. If you want the same for your own server, the simplest route is a regular Discord bot with read access to the channels you want to count:

- Listen for new messages and store only what you need for aggregates: message id, channel id, channel name, a keyed hash of the author id and the timestamp. Never keep message text or usernames.
- Keep an allowlist of public channels and skip everything else, so staff or private channels can't leak.
- Expose two endpoints behind a bearer token: `GET /health` returning `{"ok": true}` and `GET /statistik?seit=<unix>` returning rows `[id, channel_id, channel_name, author_hash, unix_time]` newer than `seit`, at most 5000 per call.

Point this server at it with `DISCORD_URL` and `DISCORD_TOKEN`. Without them the Discord section simply stays hidden.

## Run

```sh
GH_TOKEN=... node server.mjs
```

Sign-in additionally needs `OAUTH_ID`, `OAUTH_SECRET` and `BASE_URL`. Secrets can also be mounted as files in `/run/secrets/` (`gh_token`, `oauth_id`, `oauth_secret`, `discord_url`, `discord_token`).

| Env | Default |
| --- | --- |
| `PORT` | `8080` |
| `DATA` | `./data` |
| `WEB` | `./web` |
| `BASE_URL` | `http://localhost:8080` |
| `DISCORD_URL` | unset |
| `DISCORD_TOKEN` | unset |

## Docker

```sh
docker compose up -d --build
```

## Contributing

Pull requests are welcome. Thanks to [@benandez](https://github.com/benandez) for the sticky leaderboard header.

Contact: andrin.zimmermann@proton.me

Fonts: Archivo, Inter and Geist Mono under the SIL Open Font License (see `web/fonts`).
