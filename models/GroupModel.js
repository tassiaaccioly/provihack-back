const { Schema, model } = require("mongoose");

const GroupSchema = new Schema(
  {
    challenge: { type: Schema.Types.ObjectId },
    groupNumber: { type: Number, required: true },
    groupAreas: [{ type: String }],
    deliverables: [{ type: String }],
    ranking: { type: Number },
    feedback: { type: Schema.Types.ObjectId },
    members: [{ type: Schema.Types.ObjectId }],
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

const GroupModel = model("Group", GroupSchema);

module.exports = GroupModel;
