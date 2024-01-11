# install node
FROM node:18-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

# RUN mkdir -p /usr/app/node_modules && chown -R root:root /usr/app

# #INSTALL AND RUN NPM 

# WORKDIR /usr/app

# COPY package*.json ./

# ENV NODE_ENV prod

# RUN npm ci --only=dev

# COPY --chown=node:node . ./

EXPOSE 3000

CMD ["npm start"]