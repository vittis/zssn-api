FROM node:10-alpine

WORKDIR /usr/app
ADD package*.json yarn.lock ./

RUN yarn

COPY . /usr/app

USER node