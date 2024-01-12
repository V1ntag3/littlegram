FROM node:21-alpine

USER root

RUN mkdir -p /apps/littlegram/node_modules && chown -R root:root /apps/littlegram

WORKDIR /apps/littlegram

COPY package*.json ./

RUN npm install

COPY --chown=root:root . .

EXPOSE 3000

CMD [ "npm", "start" ]
