FROM node:14-alpine
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*
RUN mkdir /app
WORKDIR /app
COPY . .
RUN yarn install

LABEL maintainer="Muganwas <stevenmuganwa@gmail.com>" version='1.0'
CMD yarn start