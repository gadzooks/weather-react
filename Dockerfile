# pull the official base image
FROM node:12.18.2 as build
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN rm -rf ./node_modules
RUN npm i
# add app
COPY . ./
# start app
RUN npm run build

ENV NODE_ENV production

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

# CMD ["npm", "run", "start"]
