const { Schema, model } = require("mongoose");

const ChallengeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    company: {
      type: Schema.Types.ObjectId,
      autopopulate: true,
      required: true,
      default: "Hackatanga",
    },
    beginDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    areas: [{ type: String, required: true }],
    participants: [{ type: Schema.Types.ObjectId, autopopulate: true }],
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

ChallengeSchema.plugin(require("mongoose-autopopulate"));

const ChallengeModel = model("Challenge", ChallengeSchema);

module.exports = ChallengeModel;
