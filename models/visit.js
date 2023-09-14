const mongoose = require("mongoose");
const visitorSchema = mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  date: { type: Date, required: true },
});

visitorSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

visitorSchema.set("toJSON", {
  virtuals: true,
});
exports.Visit = mongoose.model("Visitor", visitorSchema);
