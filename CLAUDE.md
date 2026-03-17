# CLAUDE.md

This file defines repo-specific instructions for Claude Code.

## Read first

- Always read `AGENTS.md` before making changes.
- Treat `AGENTS.md` as the primary policy document for this repository.

## Execution rules for Claude Code

- Prefer minimal, targeted edits.
- Keep current architecture (`docker + nginx + static pages`) unless asked.
- Do not add extra public ports without explicit user request.
- Keep `zww.mrvn.site -> host 13140` proxy behavior.
- Keep other existing subdomains as pure static unless requested otherwise.

## Validation before finishing

Run (or instruct user to run) these commands:

```bash
docker compose config
docker compose up -d
docker compose ps
```

If routing changed, verify:

```bash
curl -I -H 'Host: what.mrvn.site' http://127.0.0.1
curl -I -H 'Host: zww.mrvn.site' http://127.0.0.1
```

## Documentation sync

If behavior/routing/ports changed, update:

- `README.md`
- `PORTS.md`

