const BookInstance = require("../models/bookInstance");
const Book = require("../models/book");

const { body, validationResult } = require("express-validator");
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
  Book.find({}, "title").exec((err, books) => {
    if (err) {
      return next(err);
    }
    res.render("bookInstanceForm", {
      title: "Create Book Instance",
      bookList: books,
    });
  });
};

// handling book  instance creation post
exports.bookInstanceCreatePost = [
  body("book", "Book is required").trim().isLength({ min: 3 }).escape(),
  body("imprint", "Imprint is required").trim().isLength({ min: 3 }).escape(),
  body("status", "Status is required").escape(),
  body("dueBack", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
    });

    if (!errors.isEmpty()) {
      Book.find({}, "title").exec((err, books) => {
        if (err) {
          return next(err);
        }
        res.render("bookInstanceForm", {
          title: "Create Book Instance",
          bookList: books,
          selectedBook: bookInstance.book._id,
          errors: errors.array(),
          bookInstance,
        });
      });
      return;
    }

    // processing valid data
    bookInstance.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(bookInstance.url);
    });
  },
];

// display book instance update get
exports.bookInstanceUpdateGet = (req, res, next) => {
  BookInstance.findById(req.params.id).exec((err, result) => {
    if (err) {
      return next(err);
    }
    res.render("bookInstanceForm", {
      title: `Update Book Instance`,
      bookInstance: result,
    });
  });
};

// handle book instance update post
exports.bookInstanceUpdatePost = [
  body("book", "Book is required").trim().isLength({ min: 3 }).escape(),
  body("imprint", "Imprint is required").trim().isLength({ min: 3 }).escape(),
  body("status", "Status is required").escape(),
  body("dueBack", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body,
      imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      BookInstance.findById(req.params.id).exec((err, result) => {
        if (err) {
          return next(err);
        }
        res.render("bookInstanceForm", {
          title: `Update Book Instance`,
          bookInstance,
          errors: errors.array(),
        });
      });
    }

    BookInstance.findByIdAndUpdate(
      req.params.id,
      bookInstance,
      (err, theBookInstance) => {
        if (err) {
          return next(err);
        }
        res.redirect(theBookInstance.url);
      }
    );
  },
];

// display book instance delete get.
exports.bookInstanceDeleteGet = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function (err, bookInstance) {
      if (err) {
        return next(err);
      }
      if (bookInstance == null) {
        // No results.
        res.redirect("/catalog/bookInstances");
      }
      // Successful, so render.
      res.render("bookInstanceDelete", {
        title: "Delete BookInstance",
        bookInstance: bookInstance,
      });
    });
};

// handle BookInstance delete on post
exports.bookInstanceDeletePost = (req, res, next) => {
  // Assume valid BookInstance id in field.
  BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
    if (err) {
      return next(err);
    }
    // Success, so redirect to list of BookInstance items.
    res.redirect("/catalog/bookinstances");
  });
};
