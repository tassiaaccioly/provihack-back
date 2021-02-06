const { Schema, model } = require("mongoose");

const ChallengeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    company: { type: String, default: "Hackatanga" },
    beginDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rules: { type: String },
    areas: [{ type: String, required: true }],
    available: { type: Boolean, default: true },
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
