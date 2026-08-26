# Vue Dashboard

A modern Vue 3 dashboard starter for building internal tools, admin panels, and analytics interfaces with a clean developer experience.

The project combines Vue 3, TypeScript, Vite, Pinia, and Vue Router with production-focused tooling for linting, testing, and deployment.

## Features

- Vue 3 + TypeScript + Vite
- Pinia state management
- Vue Router-based navigation
- Tailwind CSS styling
- OpenAPI client generation support
- Unit testing with Vitest
- End-to-end testing with Playwright
- ESLint, Oxlint, and Prettier for code quality
- GitHub Actions verification workflow
- Fly.io deployment configuration

## Tech Stack

- Frontend: Vue 3, Vite, TypeScript
- State management: Pinia
- Routing: Vue Router
- Styling: Tailwind CSS
- API layer: generated client from OpenAPI spec
- Testing: Vitest, Playwright
- CI/CD: GitHub Actions, Fly.io

## Quick Start

```bash
npm install
npm run dev
```

Then open the app in your browser at:

- http://localhost:5173

## Available Scripts

```bash
npm run dev          # start Vite dev server
npm run build        # type-check + production build
npm run preview      # preview production build locally
npm run test:unit    # run Vitest unit tests
npm run test:e2e     # run Playwright end-to-end tests
npm run lint         # run lint checks
npm run format       # run Prettier
npm run gen-api      # regenerate API client from OpenAPI spec
```

## End-to-End Testing

Playwright requires browser binaries to be installed once per environment:

```bash
npx playwright install --with-deps chromium firefox webkit
```

Then run:

```bash
npm run test:e2e
```

## Project Structure

```text
src/
  api/             # generated API client and types
  components/      # shared UI components
  pages/           # route-level views
  router/          # Vue Router configuration
  stores/          # Pinia stores
  assets/          # static assets and styles

e2e/               # Playwright tests
.github/           # GitHub workflows and templates
public/            # public static files
```

## CI/CD

This repository includes a GitHub Actions workflow that verifies the app before deployment and deploys it to Fly.io on pushes to the main branch.

Required secret for deployment:

- `FLY_API_TOKEN`

## Security

Please review [SECURITY.md](./SECURITY.md) for vulnerability reporting guidance.

## Contributing

We welcome contributions. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and follow the project code of conduct in [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the [MIT License](./LICENSE).

## Support

If you need help, see [SUPPORT.md](./SUPPORT.md).
