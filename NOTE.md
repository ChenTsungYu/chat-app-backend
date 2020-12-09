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
建好Seeder 後，至 seeders 資料夾內修改建立好的檔案
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
## Deploy on Google Compute Engine
[(Medium Tutorial) Node to Google Cloud Compute Engine](https://medium.com/google-cloud/node-to-google-cloud-compute-engine-in-25-minutes-7188830d884e)
[(YT Tutorial) Deploying NodeJS apps to a Google Cloud VM](https://www.youtube.com/watch?v=lKR596FgHsk&ab_channel=Inquiryum)
[Ithome](https://ithelp.ithome.com.tw/articles/10197669)
[How To Install Node.js on Google Cloud with Ubuntu 18.04 and Nginx – HTTPS](https://www.cloudbooklet.com/how-to-install-node-js-on-google-cloud-with-ubuntu-18-04-and-nginx/)
### Spec
- Ubuntu 18.04
- E2-small
## Set up Environment in cloud shell
```
sudo apt install update
sudo apt install nodejs npm
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo apt install nginx
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
APP_URL=http://127.0.0.1
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