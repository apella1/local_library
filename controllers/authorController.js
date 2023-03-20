const Author = require("../models/author");
const Book = require("../models/book");

const async = require("async");

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
exports.authorCreateGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create get");
};

// handle author create on post
exports.authorCreatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create post");
};

// display author delete form on get
exports.authorDeleteGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete form");
};

// handle author delete on post
exports.authorDeletePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete post");
};

// display author update form on get
exports.authorUpdateGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update get");
};

// handle author update on post
exports.authorUpdatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update post");
};
