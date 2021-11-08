const { Sequelize } = require('sequelize');
const db = require('../db/database');

const User = db.define('Usuarios', {
  id: {
    type: Sequelize.STRING,
     allowNull: false,
     primaryKey: true

  },  
    password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
 nombreCompleto: {
    type: Sequelize.STRING,
    allowNull: false,
  }, 
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
   fechaDeNacimiento: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  lenguajeDeProgramacionFavorito: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  },Visible: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
  }},{
 timestamps: false});

module.exports = User;
