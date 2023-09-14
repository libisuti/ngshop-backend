const mongoose = require("mongoose");
const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],
});

categoriesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categoriesSchema.set("toJSON", {
  virtuals: true,
});
exports.Categories = mongoose.model("Categoriesfollow", categoriesSchema);
