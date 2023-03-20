const Genre = require("../models/genre");
const Book = require("../models/book");

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
exports.genreCreateGet = (req, res) => {
  res.send("Genre Creation: not implemented");
};

// handling genre creation post
exports.genreCreatePost = (req, res) => {
  res.send("genre creation post: not implemented");
};

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
