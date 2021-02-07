const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Group = require("../models/GroupModel");
const BigChallenge = require("../models/BigChallengeModel");
const Feedback = require("../models/FeedbackModel");

router.post(
  "/group/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { groupNumber } = req.body;

      const challengeId = req.params.id;

      const errors = {};

      if (!groupNumber) {
        errors.groupNumber = "Group number is required";
      }

      // Se o objeto errors tiver propriedades (chaves), retorne as mensagens de erro
      if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
      }

      const result = await Group.create({
        ...req.body,
        challenge: challengeId,
      });

      const challenge = await BigChallenge.findOne({ _id: challengeId });

      const groups = challenge.groups;

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

//pegar todos os grupos de um challenge específico
router.get(
  "/groups/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const challengeId = req.params.id;

      const result = await BigChallenge.findOne({ _id: challengeId });

      const groups = result.groups;

      return res.status(200).json({ groups });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//pegar um grupo específico
router.get(
  "/group/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const groupId = req.params.id;

      const result = await Challenge.find({ _id: groupId });

      return res.status(200).json({ result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//postar Feedbacks
router.post(
  "/group/feedback/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const groupId = req.params.id;

      const companyId = req.company._id;

      const group = await Group.findOne({ _id: id });

      const feedback = await Feedback.create({
        ...req.body,
        company: companyId,
        challenge: group.challenge,
        group: groupId,
      });

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
