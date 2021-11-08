const express = require("express");
const router = express.Router();
const RepositoriesModel = require("../models/Repositories");
const client = require("../middleware/Redis");
const checkAdmin = require("../middleware/Admin");
const checkAuth = require("../middleware/Auth");

router.get("/", checkAuth, async (req, res) => {
  try {
    const repositories = await RepositoriesModel.findAll();
    console.log("Getting repositories");
    res.status(200).json({ repositories });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/add", checkAuth, (req, res) => {
  const data = req.body;
  let { id, NombreRepositorio, lenguajeDeProgramacion, Descripcion } = data;
  client.get("id", async (err, idUsuario) => {
    if (err) {
      console.log(err);
    } else {
      try {
        const repositoriesRegistred = await RepositoriesModel.findAll({
          where: { id },
        });

        if (repositoriesRegistred.length) {
          res
            .status(409)
            .json({ message: `Username in use, Please chose other` });
        } else {
          const newRepositories = await RepositoriesModel.create({
            id,
            idUsuario,
            NombreRepositorio,
            lenguajeDeProgramacion,
            Descripcion,
            fechaDeCreacion: Date.now(),
          });
          res.status(200).json({ message: "Repository created succesfully!" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error while creating repository" });
      }
    }
  });
});

router.delete(`/delete/:data`, checkAuth, checkAdmin, async (req, res) => {
  try {
    const data = req.params.id;

    const removedRepositorie = await RepositoriesModel.destroy({
      where: { id: data },
    });
    if (!removedRepositorie) {
      return res.status(404).json({ message: "Repositorie not found" });
    } else {
      res.status(200).json({ message: "Repositore Deleted!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
