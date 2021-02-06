const { Schema, model } = require("mongoose");

const FeedbackSchema = new Schema(
  {
    feedback: { type: String, required: true },
    strongPoints: [{ type: String, required: true }],
    company: { type: Schema.Types.ObjectId, autopopulate: true },
    challenge: { type: Schema.Types.ObjectId, autopopulate: true },
    group: { type: Schema.Types.ObjectId, autopopulate: true },
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

FeedbackSchema.plugin(require("mongoose-autopopulate"));

const FeedbackModel = model("Feedback", FeedbackSchema);

module.exports = FeedbackModel;
