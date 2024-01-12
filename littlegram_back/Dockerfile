# install node
FROM node:21-alpine

RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app

WORKDIR /usr/app

COPY package*.json ./

RUN npm link typescript

RUN npm install

COPY --chown=node:node . ./

EXPOSE 3333

CMD ["npm","run","dev"]