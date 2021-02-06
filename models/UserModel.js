const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    gender: {
      type: string,
      enum: [
        "homem cis",
        "mulher cis",
        "mulher trans",
        "homem trans",
        "sem gênero",
        "prefiro não definir",
      ],
    },
    areas: [{ type: String }],
    challengesAttended: [
      { type: Schema.Types.ObjectId, ref: "Challenge", autopopulate: true },
    ],
    challengesDoing: [
      { type: Schema.Types.ObjectId, ref: "Challenge", autopopulate: true },
    ],

    // avatar: {
    //   type: String,
    //   default:
    //     "https://res.cloudinary.com/tassiaaccioly/image/upload/v1608044548/ironnotes/bunnyyy_yqiwod.png",
    // },
  },
  {
    toJSON: {
      transform: (doc, returnDoc) => {
        delete returnDoc.__v;
        return returnDoc;
      },
    },
  }
);

UserSchema.plugin(require("mongoose-autopopulate"));

const UserModel = model("User", UserSchema);

module.exports = UserModel;
