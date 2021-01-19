const env = require('./env.js')
const Sequelize=require('sequelize')
let conn
const mysql = require('mysql2/promise')
mysql.createConnection({
  user: env.username,
  password: env.password
})
  .then((connection) => {
      conn = connection
      return connection.query(`CREATE DATABASE IF NOT EXISTS ${env.database}`)
  })
  .then(() => {
      return conn.end()
  })
  .catch((err) => {
      console.warn(err.stack)
  })


const sequelize = new Sequelize(env.database, env.username, env.password, {
    dialect: env.dialect
  });

const db={}

db.Sequelize=Sequelize
db.sequelize=sequelize

db.users=require('../model/users.model.js')(sequelize, Sequelize)
db.groups=require('../model/groups.model.js')(sequelize, Sequelize)
db.users_groups=require('../model/users_groups.model.js')(sequelize, Sequelize)
db.notes=require('../model/notes.model.js')(sequelize, Sequelize)
db.web_notes=require('../model/web_notes.model.js')(sequelize, Sequelize)
db.links=require('../model/links.model.js')(sequelize, Sequelize)


module.exports = db;