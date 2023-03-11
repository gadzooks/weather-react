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

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
