.PHONY: dev build preview generate lint lint-fix format typecheck clean

dev:
	pnpm nuxi dev

build:
	pnpm nuxi build

preview:
	pnpm nuxi preview

generate:
	pnpm nuxi generate

lint:
	pnpm eslint .

lint-fix:
	pnpm eslint . --fix

format:
	pnpm prettier --write "app/**/*.{vue,ts,css,json}"

typecheck:
	pnpm nuxi typecheck

clean:
	rm -rf .nuxt .output node_modules/.cache
