# AGENTS.md

Repository guide for AI coding agents (Cursor / Claude Code compatible).

## 1) Project overview

- Domain: `mrvn.site`
- Infra: `docker + nginx` on Ubuntu server
- Public entry: host port `80` only
- Site mode:
  - Pure static: `claw`, `ds`, `help`, `who`, `what`, `how`, `when`, `why`, `ai`, root (`@`, `www`)
  - Dynamic reserved: `zww` -> reverse proxy to host `13140` service

## 2) Source of truth

- Nginx vhost config: `nginx/conf.d/sites.conf`
- Static pages: `sites/<subdomain>/index.html`
- zww dynamic service files: `services/zww-service/*`
- Compose runtime: `docker-compose.yml`
- Mapping docs: `PORTS.md`, `README.md`

When behavior changes, update code and docs together.

## 3) Required tech conventions

- Keep all pages compatible with static hosting.
- Keep CDN setup:
  - Tailwind: `https://cdn.tailwindcss.com`
  - Motion ESM: `https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm`
- Do not introduce build tools unless explicitly requested.
- Default language for docs/comments: Chinese concise style.

## 4) Routing conventions

- All domains are accessed without custom port from user side.
- Keep Nginx `listen 80;` for each vhost.
- `zww.mrvn.site` must proxy to `host.docker.internal:13140`.
- Other subdomains should remain pure static unless user asks to switch.
- Preserve headers in proxy blocks:
  - `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`

## 5) Safe change boundaries

- Allowed by default:
  - Edit static HTML files under `sites/`
  - Edit `services/zww-service/*`
  - Edit `nginx/conf.d/sites.conf`
  - Edit docs
- Must ask before:
  - Adding HTTPS cert automation
  - Exposing new public host ports
  - Introducing Node/PNPM build pipeline
  - Replacing Docker/Compose strategy

## 6) Run / verify commands

```bash
docker compose down --remove-orphans
docker compose up -d
docker compose ps
docker compose config
```

Nginx routing checks:

```bash
curl -I -H 'Host: what.mrvn.site' http://127.0.0.1
curl -I -H 'Host: zww.mrvn.site' http://127.0.0.1
```

zww dynamic service local start:

```bash
npx http-server ./services/zww-service -p 13140 -a 0.0.0.0 -c-1
```

## 7) Delivery checklist (every change)

- Config parses: `docker compose config` passes
- Container healthy: `docker compose ps` shows running
- At least one static domain returns `200`
- `zww` behavior matches expected mode (proxy to `13140`)
- `README.md` / `PORTS.md` updated if routing or behavior changed

## 8) Commit message style

Prefer concise scope + purpose:

- `chore: update nginx vhost routing docs`
- `feat: improve static site template with CDN motion`
- `fix: restore zww reverse proxy to host 13140`

## 9) Quick task playbooks

- Add new static subdomain:
  1. Add `sites/<name>/index.html`
  2. Add vhost in `nginx/conf.d/sites.conf`
  3. Update `PORTS.md` and `README.md`
  4. Restart compose and verify

- Switch one domain to dynamic service:
  1. Replace its `location` with `proxy_pass`
  2. Keep proxy headers
  3. Ensure backend service listens on host target port
  4. Verify with `curl -H 'Host: ...'`

