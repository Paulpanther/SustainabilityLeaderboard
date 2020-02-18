FROM node:10 AS build

WORKDIR /app/

ADD package-lock.json package.json ./
RUN npm ci

ADD index.html ./
ADD src ./src/
ADD styles ./styles/

RUN npm run-script build

FROM nginx:1.17.6

WORKDIR /app/

ADD ./entrypoint.sh ./nginx.conf /app/

ENV SCOREBOARD_WS_HTTP_ADDRESS=""
ENV SCOREBOARD_API_HTTP_ADDRESS=""
ENV CORS_PROXY_ADDRESS=""

COPY --from=build /app/dist /usr/share/nginx/html

CMD /app/entrypoint.sh
