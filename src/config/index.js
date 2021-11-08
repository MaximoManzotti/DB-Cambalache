const dotenv = require('dotenv');
const envFound = dotenv.config();

if(!envFound){
    throw new Error("Couldn't find .env file.");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  

module.exports = {
    port: process.env.PORT,
    api: {
        url: 'https://cambalache-api.herokuapp.com'
    },
    swagger: {
        path: 'documentacion-api.netlify.app'
    },
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: 'mysql',
    
}
