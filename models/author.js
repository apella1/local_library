const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 100,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 100,
  },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
});

// creating name as a virtual field in case an author doesn't have
// a firstName or a lastName - handling the exception by returning an empty string

AuthorSchema.virtual("name").get(function () {
  if (this.firstName && this.lastName) {
    fullName = `${this.firstName}, ${this.lastName}`;
  }
  if (!this.firstName || !this.lastName) {
    fullName = ``;
  }
  return fullName;
});

// virtual field for individual author url
// virtual fields are not persisted in the database

AuthorSchema.virtual("url").get(function () {
  return `catalog/author/${this._id}`;
});

module.exports = mongoose.model("Author", AuthorSchema);
