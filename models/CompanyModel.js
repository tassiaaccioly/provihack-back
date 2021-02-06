const { Schema, model } = require("mongoose");

const CompanySchema = new Schema(
  {
    companyname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    linkedin: { type: String },
    partnerSince: { type: Date, default: new Date().getYear() + 1900 },
    challenges: [{ type: Schema.Types.ObjectId, autopopulate: true }],
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

CompanySchema.plugin(require("mongoose-autopopulate"));

const CompanyModel = model("Company", CompanySchema);

module.exports = CompanyModel;
