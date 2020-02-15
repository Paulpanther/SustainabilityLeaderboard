FROM node:10.16.0-alpine

ADD package.json yarn.lock ./
RUN yarn

ADD . ./

CMD yarn start