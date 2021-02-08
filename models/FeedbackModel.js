const { Schema, model } = require("mongoose");

const FeedbackSchema = new Schema(
  {
    feedback: { type: String, required: true },
    strongPoints: [{ type: String, required: true }],
    company: { type: Schema.Types.ObjectId },
    challenge: { type: Schema.Types.ObjectId },
    group: { type: Schema.Types.ObjectId },
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

const FeedbackModel = model("Feedback", FeedbackSchema);

module.exports = FeedbackModel;
