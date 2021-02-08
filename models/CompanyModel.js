const { Schema, model } = require("mongoose");

const CompanySchema = new Schema(
  {
    companyname: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    linkedin: { type: String },
    partnerSince: { type: Date, default: new Date().getYear() + 1900 },
    challenges: [{ type: Schema.Types.ObjectId }],
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

const CompanyModel = model("Company", CompanySchema);

module.exports = CompanyModel;
