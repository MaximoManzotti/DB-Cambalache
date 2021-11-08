const { Sequelize } = require('sequelize');
const db = require('../db/database');

const Repositories = db.define('Repositorios', {
  id: {
    type: Sequelize.STRING,
     allowNull: false,
     primaryKey: true

  },  NombreRepositorio: {
    type: Sequelize.STRING,
    allowNull: false,
  }, 
 lenguajeDeProgramacion: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }, 
   Descripcion: {
    type: Sequelize.STRING,
    allowNull: false,
 },
idUsuario:{
  type: Sequelize.STRING,
    allowNull: false,
},
  fechaDeCreacion:{
  type: Sequelize.DATE
}
},{
timestamps:false
});

module.exports = Repositories;
