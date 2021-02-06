const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

router.post("/user/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const errors = {};
  // Validacao de nome de usuario: é obrigatório, tem que ser do tipo string e não pode ter mais de 50 caracteres
  if (!username || typeof username !== "string" || username.length > 50) {
    errors.username = "Username is required and should be 50 characters max.";
  }

  // Tem que ser um email valido, é obrigatório
  if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
    errors.email = "Email is required and should be a valid email address";
  }

  // Senha é obrigatória, precisa ter no mínimo 8 caracteres, precisa ter letras maiúsculas, minúsculas, números e caracteres especiais
  if (
    !password ||
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    )
  ) {
    errors.password =
      "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character";
  }

  // Se o objeto errors tiver propriedades (chaves), retorne as mensagens de erro
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  // Criptografia da senha
  try {
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    const passwordHash = await bcrypt.hash(password, salt);

    const result = await User.create({
      ...req.body,
      email,
      username,
      passwordHash,
    });

    console.log(result);

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    } else if (err.code === 11000) {
      return res.status(400).json({
        error:
          "Name and email need to be unique. Either username or email is already being used.",
      });
    }
  }
});

router.post("/user/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }

    // Caso este email não esteja cadastrado ou a senha esteja divergente
    if (!user || info) {
      return res.status(401).json({ msg: info.message });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      const { username, email, _id } = user;
      const userObj = { username, email, _id };
      const token = jwt.sign({ user: userObj }, process.env.TOKEN_SIGN_SECRET);

      return res.status(200).json({ user: userObj, token });
    });
  })(req, res, next);
});

router.get(
  "/user/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.user);

      const result = await User.findOne({ _id: req.user._id }).populate(
        "pagesCreated"
      );

      return res
        .status(200)
        .json({ message: "This is a protected route", user: result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//Edit Profile
router.patch(
  "/user/profile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        username,
        email,
        gender,
        description,
        firstName,
        lastName,
        areas,
      } = req.body;

      const result = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            username: username,
            email: email,
            gender: gender,
            description: description,
            firstName: firstName,
            lastName: lastName,
            areas: areas,
          },
        },
        { new: true }
      );

      if (result) {
        return res.status(200).json({ result });
      }
      return res.status(404).json({ msg: "User not found" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//Delete Profile
router.delete(
  "/user/profile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await User.findOneAndDelete({ _id: id });

      return res.status(204).json({});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

module.exports = router;
