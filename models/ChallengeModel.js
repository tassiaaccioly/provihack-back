const { Schema, model } = require("mongoose");

const ChallengeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/tassiaaccioly/image/upload/v1612658800/logo_hackatanga_ocf5up.svg",
    },
    company: { type: String, default: "Hackatanga" },
    beginDate: { type: String, required: true },
    endDate: { type: String, required: true },
    rules: { type: String },
    level: [
      {
        type: String,
        enum: ["iniciante", "básico", "médio", "avançado", "hackatanga"],
        required: true,
      },
    ],
    areas: [{ type: String, required: true }],
    available: { type: Boolean, default: true },
    participants: [{ type: Schema.Types.ObjectId }],
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

const ChallengeModel = model("Challenge", ChallengeSchema);

module.exports = ChallengeModel;
