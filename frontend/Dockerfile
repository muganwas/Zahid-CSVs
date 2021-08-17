FROM node:15.3-alpine
RUN mkdir /app
WORKDIR /app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn install

COPY . .

LABEL maintainer="Muganwas <stevenmuganwa@gmail.com>" version='1.0'
CMD yarn start