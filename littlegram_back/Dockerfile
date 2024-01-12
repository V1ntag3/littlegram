# install node
FROM node:21-alpine

RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app

WORKDIR /usr/app

COPY package*.json ./



RUN npm config set registry https://registry.npmjs.org/

RUN npm link typescript
RUN npm install npm@latest
RUN npm install
RUN npm install  --registry http://registry.npmjs.org/


COPY --chown=node:node . ./

EXPOSE 3333

RUN npm run migration:run


CMD ["npm","run","dev"]
