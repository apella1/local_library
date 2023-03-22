const Genre = require("../models/genre");
const Book = require("../models/book");
const { body, validateResult, validationResult } = require("express-validator");

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
exports.genreCreateGet = (req, res, next) => {
  res.render("genreForm", { title: "Create Genre" });
};

// handling genre creation post
exports.genreCreatePost = [
  // validating and sanitizing data
  body("category", "Genre category is required").trim().isLength({ min: 3 }).escape(),

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
      // check a genre with the same name exists
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
exports.genreUpdateGet = (req, res) => {
  res.send("genre update get: not implemented");
};

// handle genre update post
exports.genreUpdatePost = (req, res) => {
  res.send("genre update post: not implemented");
};

// genre delete get
exports.genreDeleteGet = (req, res) => {
  res.send("genre delete form: not implemented");
};

// handling genre delete
exports.genreDeletePost = (req, res) => {
  res.send("genre delete post: not implemented");
};
