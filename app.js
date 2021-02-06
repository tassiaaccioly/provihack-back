require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));
require("./config/db.config")();
require("./config/passport.config")(app);

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
