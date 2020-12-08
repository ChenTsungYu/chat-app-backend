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

