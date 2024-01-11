# install node
FROM node:21-alpine


RUN mkdir -p /apps/littlegram_front/node_modules && chown -R node:node /apps/littlegram_front

#INSTALL AND RUN NPM 

WORKDIR /apps/littlegram_front

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci --only=production

COPY --chown=node:node . ./
EXPOSE 3000
CMD ["npm start"]