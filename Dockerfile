FROM node:14.14.0-alpine
WORKDIR "/app"
COPY package*.json ./
RUN apk add --no-cache --virtual .gyp python make g++ \
   && rm -rf /var/cache/apk/*\
   && npm install \
   && apk del .gyp
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
