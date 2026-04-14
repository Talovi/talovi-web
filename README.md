# Talovi Web

Official website for [talovi.dev](https://talovi.dev) — built with Drupal 11.

---

## Local Development

**Requirements:** DDEV, Composer, Git

```bash
git clone https://github.com/Talovi/talovi-web.git
cd talovi-web
composer install
ddev start
ddev drush site:install --existing-config
ddev launch
```

---

## Deployment

```bash
./deploy.sh
```

See [deploy.sh](deploy.sh) for the full deployment sequence (push → Composer → cache clear).

---

## Theme Development

Custom theme located at `web/themes/custom/talovi_theme/`

After theme changes:

```bash
ddev drush cr
```

---

## Requirements

| Tool | Minimum version |
|------|----------------|
| PHP | 8.3+ |
| MySQL | 10.11+ |
| Composer | 2.x |
| DDEV | 1.24+ |

---

## Environment variables

Copy `.env.example` to `.env` and fill in values before running locally:

```bash
cp .env.example .env
```

---

## Related

- npm package: [github.com/Talovi/talovi](https://github.com/Talovi/talovi)
- Homepage: [talovi.dev](https://talovi.dev)
- Maintainer: [ITLasso](https://itlasso.com) — Canton, Ohio
