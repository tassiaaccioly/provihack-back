const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Challenge = require("../models/ChallengeModel");

//criando um challenge
router.post(
  "/challenge",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //desestruturando o corpo da requisição para validação
      const { name, description, beginDate, endDate, areas } = req.body;

      const errors = {};

      //validação do nome do challenge: é obrigatório, é string, com no máximo 50 caracteres
      if (!name || typeof name !== "string" || name.length > 50) {
        errors.name = "Name is required and should be 50 characters max.";
      }

      // A descrição é obrigatória e deve ter no máximo 1500 characteres
      if (
        !description ||
        typeof description !== "string" ||
        description.length > 1500
      ) {
        errors.description =
          "Description is required and should be 1500 characters max";
      }

      if (!areas || areas.length === 0) {
        errors.areas = "Areas are required and should be provided";
      }

      if (!beginDate) {
        errors.beginDate = "Begin Date is required and should be a valid date";
      }

      if (!endDate) {
        errors.endDate = "End Date is required and should be a valid date";
      }

      // Se o objeto errors tiver propriedades, retorne as mensagens de erro
      if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
      }

      const result = await Challenge.create({ ...req.body });

      console.log(result);

      return res.status(201).json({ result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//pegando todos os challenges disponíveis na plataforma
router.get(
  "/challenge",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //retorna apenas aqueles challenges que estiverem desponíveis
      const result = await Challenge.find({ available: true });

      return res.status(200).json({ result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//tornando um challenge indisponível na plataforma, mas mantendo ele na database
router.delete(
  "/challenge/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;

      //muda a disponibilidade do challenge.
      await Challenge.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            available: false,
          },
        },
        { new: true }
      );

      res.status(204).json({});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

module.exports = router;
