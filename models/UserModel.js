const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    description: { type: String },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    gender: {
      type: String,
      enum: [
        "mulher cis",
        "homem cis",
        "mulher trans",
        "homem trans",
        "sem gênero",
        "prefiro não identificar",
      ],
    },
    areas: [{ type: String }],
    bigChallenges: [
      { type: Schema.Types.ObjectId, ref: "BigChallenge", autopopulate: true },
    ],
    challenges: [
      { type: Schema.Types.ObjectId, ref: "Challenge", autopopulate: true },
    ],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group", autopopulate: true }],
    feedbacks: [{ type: Schema.Types.ObjectId, autopopulate: true }],
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
