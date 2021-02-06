const { Schema, model } = require("mongoose");

const GroupSchema = new Schema(
  {
    challenge: { type: Schema.Types.ObjectId, autopopulate: true },
    groupNumber: { type: Number, required: true },
    groupAreas: [{ type: String }],
    deliverables: [{ type: String }],
    ranking: { type: Number },
    feedback: { type: Schema.Types.ObjectId, autopopulate: true },
    members: [{ type: Schema.Types.ObjectId, autopopulate: true }],
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

GroupSchema.plugin(require("mongoose-autopopulate"));

const GroupModel = model("Group", GroupSchema);

module.exports = GroupModel;
