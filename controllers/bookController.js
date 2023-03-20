const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookInstance");

const async = require("async");

// displaying homepage
exports.index = (req, res) => {
  async.parallel(
    {
      bookCount(callback) {
        Book.countDocuments({}, callback);
      },
      bookInstanceCount(callback) {
        BookInstance.countDocuments({}, callback);
      },
      bookInstanceAvailableCount(callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      authorCount(callback) {
        Author.countDocuments({}, callback);
      },
      genreCount(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

// displaying all books
exports.bookList = (req, res, next) => {
  Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec(function (err, listBooks) {
      if (err) {
        return next(err);
      }
      res.render("bookList", { title: "Book List", bookList: listBooks });
    });
};

// displaying a single book
exports.bookDetail = (req, res, next) => {
  async.parallel(
    {
      book(callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      bookInstance(callback) {
        BookInstance.find({ book: req.params.id });
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookDetail", {
        title: results.book.title,
        book: results.book,
        bookInstances: results.bookInstance,
      });
    }
  );
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
