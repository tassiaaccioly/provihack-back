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

app.listen(process.env.PORT),
  () => {
    console.log(`Server up an running on PORT ${process.env.PORT}`);
  };
