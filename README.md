# Static site cluster for mrvn.site

This project runs multiple static sites with `docker compose` + `nginx`.

## Quick start

```bash
docker compose up -d
```

Check container:

```bash
docker compose ps
```

## Test locally on server

After deploy to `43.139.56.44`, you can test:

```bash
curl -I http://127.0.0.1
curl -I http://127.0.0.1:13130
curl -I http://127.0.0.1:13140
curl -I http://127.0.0.1:13139
```

Or test using domains:

```bash
curl -I http://mrvn.site
curl -I http://www.mrvn.site
curl -I http://mrvn.site:13130
curl -I http://zww.mrvn.site:13140
curl -I http://ai.mrvn.site:13139
```

## Important mapping

- `zww.mrvn.site` -> `13140` (must keep)
- `mrvn.site` and `www.mrvn.site` -> `80` (standard), `13130` (fallback)

Full mapping is in `PORTS.md`.

## File structure

- `docker-compose.yml`: container and port exposure
- `nginx/conf.d/sites.conf`: nginx vhost config for all subdomains
- `sites/<subdomain>/index.html`: static page content
