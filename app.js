require("dotenv").config();
const express = require("express");
const cors = require("cors");

//instanciando o server
const app = express();

//configurando o express para utilizar json
app.use(express.json());

//abrindo a configuração de cors para receber requisições de qualquer lugar
app.use(cors({ origin: "*" }));

//instanciando a database
require("./config/db.config")();

//instanciando o autenticador
require("./config/passport.config")(app);

//definindo as rotas da api
const userRouter = require("./routes/user.routes");
app.use("/api", userRouter);

const registerRouter = require("./routes/register.routes");
app.use("/api", registerRouter);

const bigChallengeRouter = require("./routes/bigchallenge.routes");
app.use("/api", bigChallengeRouter);

const challengeRouter = require("./routes/challenge.routes");
app.use("/api", challengeRouter);

const groupRouter = require("./routes/group.routes");
app.use("/api", groupRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server up an running on PORT ${process.env.PORT}`);
});
