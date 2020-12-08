FROM node:14
WORKDIR /app
COPY package.json /app
RUN npm install
EXPOSE 3000
COPY . /app
CMD [ "npm", "run", "deploy"]