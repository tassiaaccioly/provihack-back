const { Schema, model } = require("mongoose");

const BigChallengeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/tassiaaccioly/image/upload/v1612658800/logo_hackatanga_ocf5up.svg",
    },
    company: { type: String, required: true },
    beginDate: { type: String, required: true },
    endDate: { type: String, required: true },
    maxParticipantsPerGroup: { type: Number, required: true },
    maxGroups: { type: Number },
    rules: { type: String },

    areas: [{ type: String, required: true }],
    available: { type: Boolean, default: true },
    participants: [{ type: Schema.Types.ObjectId }],
    groups: [{ type: Schema.Types.ObjectId }],
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

const BigChallengeModel = model("BigChallenge", BigChallengeSchema);

module.exports = BigChallengeModel;
