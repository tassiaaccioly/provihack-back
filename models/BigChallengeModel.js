const { Schema, model } = require("mongoose");

const BigChallengeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    beginDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxParticipantsPerGroup: { type: Number, required: true },
    maxGroups: { type: Number },
    rules: { type: String },
    areas: [{ type: String, required: true }],
    available: { type: Boolean, default: true },
    participants: [{ type: Schema.Types.ObjectId, autopopulate: true }],
    groups: [{ type: Schema.Types.ObjectId, autopopulate: true }],
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

BigChallengeSchema.plugin(require("mongoose-autopopulate"));

const BigChallengeModel = model("BigChallenge", BigChallengeSchema);

module.exports = BigChallengeModel;
