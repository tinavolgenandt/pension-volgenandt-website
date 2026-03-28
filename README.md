# Pension Volgenandt

Website for [Pension Volgenandt](https://www.pension-volgenandt.de), a family-run guesthouse in Breitenbach, Eichsfeld (Thuringia, Germany).

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com) (Vue 3, TypeScript)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`
- **Content:** [@nuxt/content 3](https://content.nuxt.com) (YAML collections)
- **SEO:** [@nuxtjs/seo](https://nuxtseo.com) (sitemap, robots, schema.org, hreflang)
- **Booking:** [Beds24 v2](https://beds24.com) API integration
- **Hosting:** IONOS (static generation via `nuxt generate`)
- **Package manager:** pnpm

## Languages

German (primary) and English (`/en/`). Custom i18n system with JSON locale files — see [CLAUDE.md](CLAUDE.md) for translation guidelines.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm generate     # static build → .output/public/
```

## License

All rights reserved. This is a private project for Pension Volgenandt.
