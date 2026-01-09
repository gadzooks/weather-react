# Basics
- this website is deployed on https://dashboard.render.com/
- the Express JS api is deployed on : AWS API Gateway + Lambda

## Render.com Deployment Configuration
- **Node Version:** `24.x`
- **Build Command:** `yarn build`
- **Publish Directory:** `dist`
- **Environment Variables:** `VITE_WEATHER_API`, `VITE_WEATHER_JWT_TOKEN`

## Deploy to S3 🚀
```sh
# select the correct AWS Profile
export AWS_PROFILE=saa

# specify which backend endpoint to hit. This will be set in the build command
export VITE_WEATHER_API=https://4gpn105y9k.execute-api.us-west-1.amazonaws.com/latest

yarn build

# push changes to s3
aws s3 sync dist s3://weather-react-static-site
```

# Study these more :
## Performance
- Look into performance aspects like rerender : https://levelup.gitconnected.com/14-tips-for-effortlessly-improving-your-weak-ass-react-code-4aea5500559c
- https://webpack.js.org/guides/asset-modules/#resource-assets
## ExpressJs
- https://www.toptal.com/express-js/routes-js-promises-error-handling
- https://javascript.info/async-await
## CSS
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- https://styled-components.com/docs/basics

## Useful tools : 
- https://jshint.com/install/
- https://axios-http.com/docs/example
- https://lodash.com/docs/4.17.15

## docs : 
- https://www.typescriptlang.org/docs/
- https://www.typescripttutorial.net/typescript-tutorial/typescript-extend-interface/
- https://www.becomebetterprogrammer.com/typescript-organizing-and-storing-types-and-interfaces/
- https://v5.reactrouter.com/web/guides/quick-start
- https://create-react-app.dev/docs/adding-images-fonts-and-files/
- fonts - https://fonts.google.com/specimen/Roboto+Mono#styles

# things I need to google regularly

```typescript
// define a dictionary with key/value as strings
export interface IHash {
    [details: string] : string;
} 
```

# Learnings : 
- Normalize state to make it easier to update it : 
- https://alexsidorenko.com/blog/react-update-nested-state/
- https://redux.js.org/usage/structuring-reducers/normalizing-state-shape


# Docker commands : 
https://collabnix.com/creating-your-first-react-app-using-docker/
```sh
# build image
docker build -t sample:react-app -f Dockerfile.dev .
# build prod
docker build -t mytag-production -f Dockerfile .

```

```sh
# run image in development
docker run
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 3000:3000 \
    -e VITE_WEATHER_API=http://localhost:4000 \
    sample:react-app
```

```sh
# run image in production
docker run \
    -it \
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 80:80 \    
    -e VITE_WEATHER_API=https://weather-expressjs-api.onrender.com \
    react-app-production

```

# Getting Started

This project uses **Vite** as the build tool and **Yarn** as the package manager.

## Prerequisites

- **Node.js:** Version 24.x required
- **Package Manager:** Yarn (installed automatically via Corepack)

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner (Vitest) in interactive watch mode.\
Use `yarn test:coverage` to generate a coverage report.

### `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn preview`

Preview the production build locally on [http://localhost:8080](http://localhost:8080).\
Run this after `yarn build` to test the production bundle.

### `yarn lint`

Runs ESLint with auto-fix enabled to check code quality.

### `yarn prettier:fix`

Formats all code using Prettier according to the project's style guide.

## Learn More

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Vitest Testing Framework](https://vitest.dev/)
