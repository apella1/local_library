const BookInstance = require("../models/bookInstance");

// displaying all book instances
exports.bookInstanceList = (req, res, next) => {
  BookInstance.find()
    .populate("book")
    .exec(function (err, listBookInstances) {
      if (err) {
        return next(err);
      }
      res.render("bookInstanceList", {
        title: "Book Instance List",
        bookInstanceList: listBookInstances,
      });
    });
};

// displaying a single book instance
exports.bookInstanceDetail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookInstance) => {
      if (err) {
        return next(err);
      }
      if (bookInstance == null) {
        const err = new Error("Book instance not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookInstanceDetail", {
        title: `Copy: ${bookInstance.book.title}`,
        bookInstance,
      });
    });
};

// display book instance create form
exports.bookInstanceCreateGet = (req, res) => {
  res.send("Book instance Creation: not implemented");
};

// handling book  instance creation post
exports.bookInstanceCreatePost = (req, res) => {
  res.send("Book instance creation post: not implemented");
};

// display book instance update get
exports.bookInstanceUpdateGet = (req, res) => {
  res.send("Book instance update get: not implemented");
};

// handle book instance update post
exports.bookInstanceUpdatePost = (req, res) => {
  res.send("Book instance update post: not implemented");
};

// book instance delete get
exports.bookInstanceDeleteGet = (req, res) => {
  res.send("Book instance delete form: not implemented");
};

// handling book instance delete
exports.bookDeletePost = (req, res) => {
  res.send("Book instance delete post: not implemented");
};
