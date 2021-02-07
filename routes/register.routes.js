const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const BigChallenge = require("../models/BigChallengeModel");
const Challenge = require("../models/ChallengeModel");
const User = require("../models/UserModel");
const Group = require("../models/GroupModel");

//registrando para um challenge grande
router.post(
  "/register/bigchallenge/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const challengeId = req.params.id;

      const groupId = req.body.group.id;

      const userId = req.user._id;

      await BigChallenge.findOneAndUpdate(
        { _id: challengeId },
        { $push: { participants: userId } },
        { new: true }
      );

      await Group.findOneAndUpdate(
        { _id: groupId },
        { $push: { members: userId } },
        { new: true }
      );

      const userResult = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            bigChallenges: challengeId,
            groups: groupId,
          },
        },
        { new: true }
      );

      return res.status(200).json({ userResult });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//Registrando para um challenge pequeno
router.post(
  "/register/challenge/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const challengeId = req.params.id;

      const userId = req.user._id;

      await Challenge.findOneAndUpdate(
        { _id: challengeId },
        { $push: { participants: userId } },
        { new: true }
      );

      const userResult = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            challenges: challengeId,
          },
        },
        { new: true }
      );

      return res.status(200).json({ userResult });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

module.exports = router;
