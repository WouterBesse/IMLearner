# IM Teacher 🎓

<!-- insert link to website -->
A simple website to help teach Instant Messaging slang to language learners. This project is built using Nuxt 3 and WebLLM.
The website is live at [imlearn.wouterbesse.nl](https://imlearn.wouterbesse.nl).

## Troubleshooting the website
If you encounter any issues with the website, please check the console log in the developer tools of your browser.

Most likely, the issue is related to the use of WebGPU, which is not supported by all browsers. If you are using a browser that does not support WebGPU, you can try using a different browser such as Chrome.
If it is still not working in Chrome, you can try enabling "Unsafe WebGPU Support" in `chrome://flags`. If this still does not work, using the Canary build of Chrome should fix it. Linux has more steps to make WebGPU work.

For more troubleshooting info, please check the [WebGPU Implementation Status](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) for more information.

## Nuxt Setup
### Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
