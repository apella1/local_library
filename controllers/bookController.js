const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookInstance");

const async = require("async");
const { body, validationResult } = require("express-validator");

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
exports.bookCreateGet = (req, res, next) => {
  async.parallel(
    {
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("bookForm", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

// handling book creation post
exports.bookCreatePost = [
  // converting the genre into an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === undefined ? [] : [req.body.genre];
    }
    next();
  },

  // sanitizing data
  body("title", "Title must not be empty").trim().isLength({ min: 3 }).escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 3 }).escape(),
  // using a wildcard to individually validate each of the genre array entries
  body("genre.*").escape(),

  // request processing after validation and sanitizing
  (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        // getting the authors and genres
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        // re-displaying the form with sanitized data
        (err, results) => {
          if (err) {
            return next(err);
          }
          // marking the selected genres as checked
          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          }
          res.render("bookForm", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
          return;
        }
      );
    }

    // saving valid data
    book.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(book.url);
    });
  },
];

// display book update get
exports.bookUpdateGet = (req, res, next) => {
  async.parallel(
    {
      book(callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      // ! not finding any book is not an error for search
      // ! but it is for this application because we know there must be a matching record
      if (results.book == null) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }

      // marking selected genres as checked
      for (const genre of results.genres) {
        for (const bookGenre of results.book.genre) {
          if (genre._id.toString() === bookGenre._id.toString()) {
            genre.checked = "true";
          }
        }
      }

      res.render("bookForm", {
        title: "Update Book",
        book: results.book,
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

// handle book update post
exports.bookUpdatePost = [
  // converting genres into an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      request.body.genre =
        typeof req.body.genre === undefined ? [] : [req.body.genre];
    }
    next();
  },

  // validating and sanitizing the data from the database
  body("title", "Title is required").trim().isLength({ min: 3 }).escape(),
  body("author", "Author is required").trim().isLength({ min: 3 }).escape(),
  body("summary", "Summary is required").trim().isLength({ min: 3 }).escape(),
  body("isbn", "ISBN is required").trim().isLength({ min: 3 }).escape(),
  body("genre.*").escape(),

  // checking the results of the validation
  (req, res, next) => {
    const errors = validationResult(req);

    const book = new book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === undefined ? [] : [req.body.genre],
      _id: req.params.id, // * not to assign a new id to the updated book
    });

    if (!errors.isEmpty()) {
      // querying the db before re-displaying the form
      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          // marking the selected genres as checked
          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          }

          res.render("bookForm", {
            title: "Update Book",
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
    }

    // data is valid - updating the book
    // We're updating the document model in the db
    Book.findByIdAndUpdate(req.params.id, book, {}, (err, theBook) => {
      if (err) {
        return next(err);
      }
      res.redirect(theBook.url);
    });
  },
];

// book delete get
exports.bookDeleteGet = (req, res) => {
  res.send("Book delete form: not implemented");
};

// handling book delete
exports.bookDeletePost = (req, res) => {
  res.send("Book delete post: not implemented");
};
