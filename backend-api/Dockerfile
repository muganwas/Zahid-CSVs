FROM node:15.3-alpine
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*
RUN mkdir /app
WORKDIR /app
RUN npm install -g nodemon
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn install

COPY . .

LABEL maintainer="Muganwas <stevenmuganwa@gmail.com>" version='1.0'
CMD yarn start