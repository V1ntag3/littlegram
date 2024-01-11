# install node
FROM node:21-alpine

# Definir o usuário padrão
USER root

RUN npm install -g npm@10.3.0

RUN mkdir -p /usr/app/node_modules && chown -R root:root /usr/app

#INSTALL AND RUN NPM 

WORKDIR /usr/app

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci --only=dev

COPY --chown=node:node . ./

EXPOSE 3000

CMD ["npm start"]