# ArtCraft Contributors

Contributor stats for the ArtCraft Craft app suite: https://artcraft.apollonet.dev

Node 22, no dependencies. The server syncs all pull requests of the Craft repos via the GitHub GraphQL API and serves precomputed stats plus a static frontend with hand-drawn SVG charts.

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
