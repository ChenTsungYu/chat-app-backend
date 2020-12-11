# Note
## Install dependencies
```
npm i --save express nodemon dotenv sequelize sequelize-cli pg bcrypt body-parser jsonwebtoken express-validator cors
```
## Configure environment variable
![](./src/environment_variable.png)

## Configure .sequelizerc
create .sequelizerc
```
touch .sequelizerc
```
past the code below for `sequelize init`
```
const path = require('path');

module.exports = {
    "config": path.resolve('./config', 'database.js'),
    "models-path": path.resolve('models'),
    "seeders-path": path.resolve('database', 'seeders'),
    "migrations-path": path.resolve('database', 'migrations')
}
```
initialize sequelize
```
sequelize init
```
## sequelize CLI
### Create User
```
sequelize model:create --name User --attributes firstName:string,lastName:string,email:string,password:string,gender:string,avatar:string
```
### Create/Update Migration
```
sequelize db:migrate
```
### Drop Migrated Tables
```
sequelize db:migrate:undo
```
### Create Seeder
```
sequelize seed:create --name users
```
### sequelize Seeder
```
sequelize db:seed:all    
```
### Drop Seeder
```
sequelize db:seed:undo
```

### Create Chat
```
sequelize model:create --name Chat --attributes type:string
```
### Create Chat User
```
sequelize model:create --name ChatUser --attributes chatId:integer,userId:integer
```
### Create Message
```
sequelize model:create --name Message --attributes type:string,message:text,chatId:integer,fromUserId:integer
```
## Deploy on AWS EC2
- [How to set up a Node.js application for production on EC2 Ubuntu: Hands-on!](https://www.youtube.com/watch?v=l7KlkVyWemc&feature=emb_title)
- [Setting up MERN Stack on AWS EC2](https://medium.com/@Keithweaver_/setting-up-mern-stack-on-aws-ec2-6dc599be4737)
- [React + Node.js on AWS - How to Deploy a MERN Stack App to Amazon EC2](https://www.youtube.com/watch?v=FanoTGjkxhQ&t=644s&ab_channel=JasonWatmore)
- [How To Set Up a Node.js Application for Production on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04)
- [(Github repo)nodejs-production-demo](https://github.com/codingx01/nodejs-production-demo)
- [Deploy a React/Node app on Amazon EC2: with Redis (IMDB), PostgreSQL and SSL encrypted https](https://medium.com/@wesley.coderre/deploy-a-react-node-app-with-on-amazon-ec2-with-redis-imdb-postgresql-and-ssl-encrypted-https-448fbd1624c3)
- [Free domain in AWS](https://www.youtube.com/watch?v=xwmtbU-P4GM&feature=youtu.be)
- [Have a question with NODEJS “CORS Errors”?](https://www.digitalocean.com/community/questions/have-a-question-with-nodejs-cors-errors)

### Spec
- Ubuntu 18.04
- t3-small
## Set up Environment in cloud shell
```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo apt install nginx
sudo npm install -g sequelize-cli sequelize pg express nodemon dotenv sequelize sequelize-cli pg bcrypt body-parser jsonwebtoken express-validator cors
```
### Check if environment is set up
```
node -v
npm -v
```
###  Test if Nginx installed correctly
```
curl localhost
```
### Install Node Version Manage
[Github Repo](https://github.com/nvm-sh/nvm)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```
#### Check nvm and change the version of node
```
nvm ls-remote --lts
nvm install 12.18.3
```
### PostgreSQL
#### Installation
[Installation guide](https://stackoverflow.com/questions/53434849/cannot-install-postgres-on-ubuntu-e-unable-to-locate-package-postgresql)
```
sudo apt-get install postgresql postgresql-client
```
### Set up DB password
```sql
sudo -u postgres psql
\password
\q
```
### Log in DB 
```sql
psql  -U postgres -h localhost
```
### Create an database
```
CREATE DATABASE chatapp;
```
### Show the database
```sql
\l
```
### Switching to the database 
```sql
\c chatapp;
```
### Create a new user
```
CREATE USER tom;
```
### Set password for the new user
```
\password tom;
```
### Grant all privileges to the new user 
```sql
GRANT ALL PRIVILEGES ON DATABASE chatapp TO tom;
```
### Log in the new user and switch to the database 
```bash
psql -U tom -h localhost -d chatapp;
```
# Deployment
## Clone project
```
git clone https://github.com/ChenTsungYu/chat-app-backend.git
cd chat-app-backend
```
## Create `.env`
```
sudo vim .env
```
### Past the config
```
APP_KEY=YourAppKey
APP_URL=http://YourIP
APP_PORT=3000
DB_HOST=YourDBHost
DB_USER=YourDBUserName
DB_PASSWORD=YourDBPassword
DB_DATABASE=chatApp
```
#### save and quit
```
:wq!
```
## Install process manager
```
sudo npm install pm2@latest -g
```
Start your app using the process manager
```
pm2 start app.js
```
## Configure Nginx
```
sudo vim /etc/nginx/sites-available/chatapp.conf
sudo ln -s /etc/nginx/sites-available/chatapp.conf /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```
## Configure pm2
```
sudo pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo systemctl enable pm2-root
sudo pm2 save
sudo systemctl start pm2-root
```
Check the status of `pm2-root`
```
sudo systemctl status pm2-root
```