# install node
FROM node:21-alpine


RUN mkdir -p /apps/littlegram/node_modules && chown -R node:node /apps/littlegram

#INSTALL AND RUN NPM 

WORKDIR /apps/littlegram

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci --only=production

COPY --chown=node:node . ./

CMD ["npm start"]