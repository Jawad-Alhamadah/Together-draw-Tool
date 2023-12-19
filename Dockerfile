FROM node:19-alpine3.17

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

RUN npm  install -g nodemon

RUN npm install -g browserify

WORKDIR /DrawApp

COPY ./package.json .

RUN npm install

COPY . .

RUN browserify public/ScriptsAndStyles/Draw.js -o public/bundle/bundle.js

EXPOSE 4500

CMD ["node","./server.js"]