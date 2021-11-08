const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Login = require("../models/Login");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkAdmin = require("../middleware/Admin");
const checkAuth = require("../middleware/Auth");
const client = require("../middleware/Redis");

//Se envia una peticion  GET a usuarios, se chequea si es admistrador y recibe todos los usuarios

router.get("/", checkAdmin, checkAuth, async (req, res) => {
  try {
    let user = await User.findAll();
    console.log("Getting users");
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (user.lenght > 1) {
      res.status(401).json({ message: " Unauthorized " });
    } else {
      bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (err) {
          res.status(401).json({ message: " Unauthorized " });
        } else if (result) {
          let token = JWT.sign({ id: id }, process.env.SECRET, {
            expiresIn: "1h",
          });
          client.set("token", token);
          client.set("id", id);
          const login = await Login.create({
            idUsuario: id,
            tipo: user.isAdmin,
          });
          res.status(200).json({ message: user });
        } else {
          res.status(400).json({ error: "User or Password are incorrect" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ error: "User or Password are incorrect" });
  }
});

router.put("/update/password", checkAuth, async (req, res) => {
  const newPassword = req.body.newPassword;
  client.get("id", async (err, data) => {
    try {
      const user = await User.findOne({
        where: {
          id: data,
        },
      });

      if (user.lenght > 1) {
        res.status(401).json({ message: " Unauthorized " });
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          async (err, result) => {
            if (err) {
              res.status(401).json({ message: " Unauthorized " });
            } else if (result) {
              await User.update(
                { password: newPassword },
                { where: { id: data } }
              );
              res.status(200).json({ message: user });
            } else {
              res.status(400).json({ error: "User or Password are incorrect" });
            }
          }
        );
      }
    } catch (err) {
      res.status(400).json({ error: "User or Password are incorrect" });
    }
  });
});

router.post("/register", async (req, res) => {
  const data = req.body;
  let {
    id,
    password,
    email,
    nombreCompleto,
    fechaDeNacimiento,
    lenguajeDeProgramacionFavorito,
  } = data;

  try {
    const usernameAlreadyRegistered = await User.findAll({
      where: { id },
    });
    const emailAlreadyRegistered = await User.findAll({ where: { email } });

    if (usernameAlreadyRegistered.length) {
      res.status(409).json({ message: `Username in use, Please chose other` });
    } else if (emailAlreadyRegistered.length) {
      res.status(409).json({
        message: `Email is linked with a acount`,
      });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const newUser = await User.create({
            id,
            email,
            nombreCompleto,
            fechaDeNacimiento,
            lenguajeDeProgramacionFavorito,
            password: hash,
          });
          res.status(201).json({ message: "User created succesfully!" });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: "you have empty fields or error was produce" });
  }
});

router.delete("/delete/:id`", checkAdmin, checkAuth, async (req, res) => {
  try {
    const data = req.params.id;
    const removedUser = await User.destroy({ where: { id: data } });
    if (!removedUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User Deleted!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
