const Genre = require("../models/genre");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

const async = require("async");

// displaying all genres
exports.genreList = (req, res, next) => {
  Genre.find()
    .sort([["category", "ascending"]])
    .populate("category")
    .exec(function (err, listGenre) {
      if (err) {
        return next(err);
      }
      res.render("genreList", {
        title: "Genre List",
        genreList: listGenre,
      });
    });
};

// displaying a single genre
exports.genreDetail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genreBooks(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }

      res.render("genreDetail", {
        title: "Genre Detail",
        genre: results.genre,
        genreBooks: results.genreBooks,
      });
    }
  );
};

// display genre create form
exports.genreCreateGet = (_req, res, _next) => {
  res.render("genreForm", { title: "Create Genre" });
};

// handling genre creation post
exports.genreCreatePost = [
  // validating and sanitizing data
  body("category", "Genre category is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // processing the request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // creating a genre object with escaped and trimmed data
    const genre = new Genre({ category: req.body.category });

    // re-displaying the form if there are errors
    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // data is valid
      // check if a genre with the same name exists
      Genre.findOne({ category: req.body.category }).exec((err, foundGenre) => {
        if (err) {
          return next(err);
        }
        if (foundGenre) {
          // redirecting to genre detail page
          res.redirect(foundGenre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // save successful redirecting to the saved genre's url
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// display genre update get
exports.genreUpdateGet = (req, res, next) => {
  Genre.findById(req.params.id).exec((err, result) => {
    if (err) {
      return next(err);
    }
    if (result == null) {
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }
    res.render("genreForm", {
      title: `Update: ${result.category}`,
      genre: result,
    });
  });
};

// handle genre update post
exports.genreUpdatePost = [
  // sanitizing data from db
  body("category", "Category is required").trim().isLength({ min: 3 }).escape(),

  // checking validation results
  (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Genre.findById(req.params.id).exec((err, result) => {
        if (err) {
          return next(er);
        }
        if (result == null) {
          res.redirect(`genres`);
        }
        res.render("genreForm", {
          title: `Update: ${result.category}`,
          genre,
          errors: errors.array(),
        });
      });
    }

    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, theGenre) => {
      if (err) {
        return next(err);
      }
      res.redirect(theGenre.url);
    });
  },
];
// genre delete get
exports.genreDeleteGet = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genreBooks(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("genreDelete", {
        title: `Delete: ${results.genre.category}`,
        genre: results.genre,
        genreBooks: results.genreBooks,
      });
    }
  );
};

// handling genre delete
exports.genreDeletePost = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genreBooks(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        res.redirect(`genres`);
      }
      if (results.genreBooks.length > 0) {
        res.render("genreDelete", {
          title: `Delete: ${results.genre.category}`,
          genre: results.genre,
          genreBooks: results.genreBooks,
        });
      }

      Genre.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect(`genres`);
      });
    }
  );
};
