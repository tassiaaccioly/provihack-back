const { Schema, model } = require("mongoose");

const GroupSchema = new Schema(
  {
    challenge: { type: Schema.Types.ObjectId, autopopulate: true },
    groupNumber: { type: Number, required: true },
    deliverables: [{ type: String }],
    ranking: { type: number },
    feedback: { type: String },
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
