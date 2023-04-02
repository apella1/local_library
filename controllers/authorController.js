const Author = require("../models/author");
const Book = require("../models/book");

const async = require("async");
const { body, validationResult } = require("express-validator");

// display page for specific author
exports.authorDetail = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authorBooks(callback) {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      res.render("authorDetail", {
        title: results.author.name,
        author: results.author,
        authorBooks: results.authorBooks,
      });
    }
  );
};

// listing all authors
exports.authorList = (req, res, next) => {
  Author.find()
    .sort([["firstName", "ascending"]])
    .exec(function (err, listAuthors) {
      if (err) {
        return next(err);
      }
      res.render("authorList", {
        title: "Author List",
        authorList: listAuthors,
      });
    });
};

// display author create form on get
exports.authorCreateGet = (req, res, next) => {
  res.render("authorForm", { title: "Create Author" });
};

// handle author create on post
exports.authorCreatePost = [
  body("firstName")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Last name is required"),
  body("dateOfBirth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("dateOfDeath", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("authorForm", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
    } else {
      const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        dateOfDeath: req.body.dateOfDeath,
      });
      author.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(author.url);
      });
    }
  },
];

// display author delete form on get
exports.authorDeleteGet = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authorBooks(callback) {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        res.redirect(`authors`);
      }
      res.render("authorDeleteForm", {
        title: "Delete Author",
        author: results.author,
        authorBooks: results.authorBooks,
      });
    }
  );
};

// handle author delete on post
exports.authorDeletePost = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.authorId).exec(callback);
      },
      authorBooks(callback) {
        Book.find({ author: req.params.authorId }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // checking if author has books
      if (results.authorBooks.length > 0) {
        res.render("authorDeleteForm", {
          title: "Delete Author",
          author: results.author,
          authorBooks: results.authorBooks,
        });
      }

      Author.findByIdAndRemove(req.params.authorId, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect(`authors`);
      });
    }
  );
};

// display author update form on get
exports.authorUpdateGet = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // checking for null search results
      if (results.author == null) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }

      res.render("authorForm", {
        title: "Update Author",
        author: results.author,
      });
    }
  );
};

// handle author update on post
exports.authorUpdatePost = [
  // sanitizing and validating data from db
  body("firstName", "First name is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("lastName", "Last name is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("dateOfBirth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("dateOfDeath", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // checking validation results
  (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      dateOfDeath: req.body.dateOfDeath,
      _id: req.params.id,
    });

    // re-displaying the form if there are errors
    if (!errors.isEmpty()) {
      async.parallel(
        {
          author(callback) {
            Author.findById(req.params.id).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.author == null) {
            const err = new Error("Author not found");
            err.status = 404;
            return next(err);
          }

          res.render("authorForm", {
            title: "Update Author",
            author,
            errors: errors.array(),
          });
        }
      );
    }

    // data is valid - update author
    Author.findByIdAndUpdate(req.params.id, author, {}, (err, theAuthor) => {
      if (err) {
        return next(err);
      }
      res.redirect(theAuthor.url);
    });
  },
];
