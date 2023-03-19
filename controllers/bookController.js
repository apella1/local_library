const Book = require("../models/book");

// displaying homepage
exports.index = (req, res) => {
  res.send("Homepage: not implemented");
};

// displaying all books
exports.bookList = (req, res) => {
  res.send("Books Display: not implemented");
};

// displaying a single book
exports.bookDetail = (req, res) => {
  res.send("Book details: not implemented");
};

// display book create form
exports.bookCreateGet = (req, res) => {
  res.send("Book Creation: not implemented");
};

// handling book creation post
exports.bookCreatePost = (req, res) => {
  res.send("Book creation post: not implemented");
};

// display book update get
exports.bookUpdateGet = (req, res) => {
  res.send("Book update get: not implemented");
};

// handle book update post
exports.bookUpdatePost = (req, res) => {
  res.send("Book update post: not implemented");
};

// book delete get
exports.bookDeleteGet = (req, res) => {
  res.send("Book delete form: not implemented");
};

// handling book delete
exports.bookDeletePost = (req, res) => {
  res.send("Book delete post: not implemented");
};
