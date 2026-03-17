# Static site cluster for mrvn.site

This project runs multiple static sites with `docker compose` + `nginx`.

## Quick start

```bash
docker compose down --remove-orphans
docker compose up -d
```

This setup routes all domains through host port `80` by `server_name`.

Check container:

```bash
docker compose ps
```

## Test locally on server

After deploy to `43.139.56.44`, you can test:

```bash
curl -I http://127.0.0.1
```

Or test using domains:

```bash
curl -I http://mrvn.site
curl -I http://www.mrvn.site
curl -I http://zww.mrvn.site
curl -I http://ai.mrvn.site
```

## Important mapping

- all subdomains are accessed directly without custom port
- pure static: `claw`, `ds`, `help`, `who`, `what`, `how`, `when`, `why`, `ai`
- reserved service domain: `zww` reverse proxy to host `13140`

Full mapping is in `PORTS.md`.

## File structure

- `docker-compose.yml`: container and port exposure
- `nginx/conf.d/sites.conf`: nginx vhost config for all subdomains
- `sites/<subdomain>/index.html`: static page content
