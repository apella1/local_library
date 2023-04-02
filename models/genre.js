const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  category: { type: String, required: true },
});

GenreSchema.virtual("url").get(function () {
  return `genre/${this._id}`;
});

module.exports = mongoose.model("Genre", GenreSchema);
