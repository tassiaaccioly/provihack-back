const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Company = require("../models/CompanyModel");

router.post("/company/signup", async (req, res) => {
  const { companyname, email, password } = req.body;

  const errors = {};
  // Validacao de nome da companhia: é obrigatório, tem que ser do tipo string e não pode ter mais de 50 caracteres
  if (
    !companyname ||
    typeof companyname !== "string" ||
    companyname.length > 50
  ) {
    errors.companyname =
      "Company name is required and should be 50 characters max.";
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

    const result = await User.create({ email, companyname, passwordHash });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: err.message });
    } else if (err.code === 11000) {
      return res.status(400).json({
        error:
          "Name and email need to be unique. Either Company name or email is already used.",
      });
    }
  }
});

router.post("/company/login", (req, res, next) => {
  passport.authenticate("local", (err, company, info) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }

    // Caso este email não esteja cadastrado ou a senha esteja divergente
    if (!company || info) {
      return res.status(401).json({ msg: info.message });
    }

    req.login(company, { session: false }, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      const { companyname, email, _id } = company;
      const companyObj = { companyname, email, _id };
      const token = jwt.sign(
        { company: companyObj },
        process.env.TOKEN_SIGN_SECRET
      );

      return res.status(200).json({ company: companyObj, token });
    });
  })(req, res, next);
});

router.get(
  "/company/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.company);

      const result = await Company.findOne({ _id: req.company._id });

      return res
        .status(200)
        .json({ message: "This is a protected route", company: result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//Edit Profile
router.patch(
  "/company/profile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const { companyname, email } = req.body;

      const result = await Company.findOneAndUpdate(
        { _id: id },
        { $set: { companyname: companyname, email: email } },
        { new: true }
      );

      if (result) {
        return res.status(200).json({ result });
      }
      return res.status(404).json({ msg: "Company not found." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

//Delete Profile
router.delete(
  "/company/profile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Company.findOneAndDelete({ _id: id });

      return res.status(204).json({});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: err });
    }
  }
);

module.exports = router;
