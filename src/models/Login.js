const { Sequelize } = require("sequelize");
const db = require("../db/database");
require("./Users");

const Login = db.define(
  "Login",
  {
    tipo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    idUsuario: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Login;
