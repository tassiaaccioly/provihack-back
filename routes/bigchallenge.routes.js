const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const BigChallenge = require("../models/BigChallengeModel");

//Adicionando um desafio na Database
router.post(
  "/bigchallenge",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const {
        name,
        description,
        beginDate,
        endDate,
        areas,
        maxParticipantsPerGroup,
        maxGroups,
      } = req.body;

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

      if (
        !maxParticipantsPerGroup ||
        maxParticipantsPerGroup > 10 ||
        maxParticipantsPerGroup < 3
      ) {
        errors.maxParticipantsPerGroup =
          "Max Participants per group is required and should be between 3 and 10";
      }

      if (!maxGroups || maxGroups > 40 || maxGroups < 10) {
        errors.maxGroups =
          "Max Groups is required and should be between 10 and 40";
      }

      if (!endDate) {
        errors.endDate = "End Date is required and should be a valid date";
      }

      // Se o objeto errors tiver propriedades, retorne as mensagens de erro
      if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
      }

      const result = await BigChallenge.create({ ...req.body });

      console.log(result);

      return res.status(201).json({ result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//Resgatando os desafios disponíveis na plataforma
router.get(
  "/bigchallenge",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await BigChallenge.find({ available: true });

      return res.status(200).json({ result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//tornando um desafio indisponível para a plataforma, mas mantendo ele na database
router.delete(
  "bigchallenge/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const response = await BigChallenge.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            available: false,
          },
        },
        { new: true }
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

module.exports = router;
