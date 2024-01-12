# install node
FROM node:21-alpine

RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app

WORKDIR /usr/app

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci --only=production

COPY --chown=node:node . ./

EXPOSE 3333

CMD ["npm","run","dev"]