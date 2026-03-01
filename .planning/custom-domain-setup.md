# Custom Domain Setup: pension-volgenandt.de

## Goal
Connect the registered domain `pension-volgenandt.de` (at IONOS/1&1) to the GitHub Pages deployment.

## Current State
- GitHub Pages URL: `https://tinavolgenandt.github.io/pension-volgenandt-website/`
- Build uses `NUXT_APP_BASE_URL: /pension-volgenandt-website/` (subpath)
- No CNAME file exists
- Domain registered at IONOS, DNS not yet configured

## Steps

### 1. Repo Changes (GitHub side)
- [ ] Add `public/CNAME` file with content `pension-volgenandt.de`
- [ ] Update `.github/workflows/deploy.yml`: change `NUXT_APP_BASE_URL` from `/pension-volgenandt-website/` to `/`
- [ ] Set custom domain in GitHub Pages settings via `gh api`

### 2. DNS Changes (IONOS side)
- [ ] Add A record: `@` -> `185.199.108.153`
- [ ] Add A record: `@` -> `185.199.109.153`
- [ ] Add A record: `@` -> `185.199.110.153`
- [ ] Add A record: `@` -> `185.199.111.153`
- [ ] Add CNAME record: `www` -> `tinavolgenandt.github.io`
- [ ] Remove/update any conflicting existing DNS records

### 3. Verification
- [ ] Wait for DNS propagation
- [ ] Verify GitHub Pages shows domain as configured
- [ ] Enable "Enforce HTTPS" in GitHub Pages settings
- [ ] Test `https://pension-volgenandt.de` loads correctly
- [ ] Test `https://www.pension-volgenandt.de` redirects correctly
