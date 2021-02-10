FROM node:lts

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm cache clear --force && npm install

ENTRYPOINT ["npm", "start"]