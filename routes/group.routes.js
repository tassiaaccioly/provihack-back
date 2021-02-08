const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Group = require("../models/GroupModel");
const BigChallenge = require("../models/BigChallengeModel");
const Feedback = require("../models/FeedbackModel");

//criando um grupo
router.post(
  "/group/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { groupNumber } = req.body;

      //removendo o id do challenge da URL
      const challengeId = req.params.id;

      const errors = {};

      //Validando o grupo
      if (!groupNumber) {
        errors.groupNumber = "Group number is required";
      }

      // Se o objeto errors tiver propriedades retorne as mensagens de erro
      if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
      }

      //criando o grupo
      const result = await Group.create({
        ...req.body,
        challenge: challengeId,
      });

      //adicionando o grupo à array de grupos do challenge
      await BigChallenge.findOneAndUpdate(
        { _id: challengeId },
        { $push: { groups: result._id } },
        { new: true }
      );

      console.log(result);

      return res.status(201).json({ result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//pegando todos os grupos de um desafio específico
router.get("/groups/:id", async (req, res) => {
  try {
    //salvando o id do challenge da URL
    const challengeId = req.params.id;

    //encontrando o challenge
    const result = await (
      await BigChallenge.findOne({ _id: challengeId })
    ).populate("groups");

    //separando os grupos do challenge para poder retornar
    const groups = result.groups;

    return res.status(200).json({ groups });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

//pegar um grupo específico
router.get("/group/:id", async (req, res) => {
  try {
    //resgatando o id do grupo da URL
    const groupId = req.params.id;

    //encontrando o grupo específico através do id
    const result = await Group.findOne({ _id: groupId });

    return res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

//postar Feedbacks
router.post(
  "/group/feedback/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //resgatando o id do grupo da url
      const groupId = req.params.id;

      //resgatando o id da companhia do token
      const companyId = req.company._id;

      //encontrando o grupo para poder retirar dele o id do challenge
      const group = await Group.findOne({ _id: id });

      //postando o feedback
      const feedback = await Feedback.create({
        ...req.body,
        company: companyId,
        challenge: group.challenge._id,
        group: groupId,
      });

      //adicionando o id do feedback no perfil de cada pessoa do grupo
      if (group) {
        group.members.forEach(async (member) => {
          try {
            await User.findOneAndUpdate(
              { _id: member._id },
              { $push: { feedbacks: feedback._id } },
              { new: true }
            );
          } catch (error) {
            console.error("Group Map error: ", error);
          }
        });
      }

      return res.status(200).json({ feedback });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

module.exports = router;
