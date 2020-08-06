FROM node:lts

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --production

COPY index.js ./

CMD npm start --production
