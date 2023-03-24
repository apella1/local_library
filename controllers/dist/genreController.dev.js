"use strict";

var Genre = require("../models/genre");

var Book = require("../models/book");

var _require = require("express-validator"),
    body = _require.body,
    validationResult = _require.validationResult;

var async = require("async"); // displaying all genres


exports.genreList = function (req, res, next) {
  Genre.find().sort([["category", "ascending"]]).populate("category").exec(function (err, listGenre) {
    if (err) {
      return next(err);
    }

    res.render("genreList", {
      title: "Genre List",
      genreList: listGenre
    });
  });
}; // displaying a single genre


exports.genreDetail = function (req, res, next) {
  async.parallel({
    genre: function genre(callback) {
      Genre.findById(req.params.id).exec(callback);
    },
    genreBooks: function genreBooks(callback) {
      Book.find({
        genre: req.params.id
      }).exec(callback);
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }

    if (results.genre == null) {
      var _err = new Error("Genre not found");

      _err.status = 404;
      return next(_err);
    }

    res.render("genreDetail", {
      title: "Genre Detail",
      genre: results.genre,
      genreBooks: results.genreBooks
    });
  });
}; // display genre create form


exports.genreCreateGet = function (req, res, next) {
  res.render("genreForm", {
    title: "Create Genre"
  });
}; // handling genre creation post


exports.genreCreatePost = [// validating and sanitizing data
body("category", "Genre category is required").trim().isLength({
  min: 3
}).escape(), // processing the request after validation and sanitization
function (req, res, next) {
  var errors = validationResult(req); // creating a genre object with escaped and trimmed data

  var genre = new Genre({
    category: req.body.category
  }); // re-displaying the form if there are errors

  if (!errors.isEmpty()) {
    res.render("genreForm", {
      title: "Create Genre",
      genre: genre,
      errors: errors.array()
    });
    return;
  } else {
    // data is valid
    // check if a genre with the same name exists
    Genre.findOne({
      category: req.body.category
    }).exec(function (err, foundGenre) {
      if (err) {
        return next(err);
      }

      if (foundGenre) {
        // redirecting to genre detail page
        res.redirect(foundGenre.url);
      } else {
        genre.save(function (err) {
          if (err) {
            return next(err);
          } // save successful redirecting to the saved genre's url


          res.redirect(genre.url);
        });
      }
    });
  }
}]; // display genre update get

exports.genreUpdateGet = function (req, res, next) {
  Genre.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }

    if (result == null) {
      var _err2 = new Error("Genre not found");

      _err2.status = 404;
      return next(_err2);
    }

    res.render("genreForm", {
      title: "Update: ".concat(result.category),
      genre: result
    });
  });
}; // handle genre update post


exports.genreUpdatePost = [// sanitizing data from db
body("category", "Category is required").trim().isLength({
  min: 3
}).escape(), // checking validation results
function (req, res, next) {
  var errors = validationResult(req);
  var genre = new Genre({
    category: req.body.category,
    _id: req.params.id
  });

  if (!errors.isEmpty()) {
    Genre.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return next(er);
      }

      if (result == null) {
        res.redirect("catalog/genres");
      }

      res.render("genreForm", {
        title: "Update: ".concat(result.category),
        genre: genre,
        errors: errors.array()
      });
    });
  }

  Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, theGenre) {
    if (err) {
      return next(err);
    }

    res.redirect(theGenre.url);
  });
}]; // genre delete get

exports.genreDeleteGet = function (req, res) {}; // handling genre delete


exports.genreDeletePost = function (req, res) {
  res.send("genre delete post: not implemented");
};