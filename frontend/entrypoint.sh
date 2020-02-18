#! /usr/bin/env sh

envsubst '$SCOREBOARD_WS_HTTP_ADDRESS $SCOREBOARD_API_HTTP_ADDRESS $CORS_PROXY_ADDRESS' < /app/nginx.conf > /etc/nginx/conf.d/default.conf;
exec nginx -g 'daemon off;';