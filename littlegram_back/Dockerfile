# install node
FROM node:21-alpine


#MAKE WORKING DIRECTORY AND LOGS DIRECTORY

RUN mkdir -p /app/littlegram/node_modules && chown -R node:node /app/littlegram


#INSTALL AND RUN NPM 

WORKDIR /app/littlegram

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci --only=production

COPY --chown=node:node . ./

CMD ["npm start"]