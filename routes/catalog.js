const express = require("express");

const router = express.Router();

// controllers
const bookController = require("../controllers/bookController");
const genreController = require("../controllers/genreController");
const bookInstanceController = require("../controllers/bookInstanceController");
const authorController = require("../controllers/authorController");

// Book Routes
// get catalog homepage
router.get("/", bookController.index);

// creating user GET (uses id so must come before displaying a single user or all users)
// works the same for all the other routes
router.get("/book/create", bookController.bookCreateGet);
router.post("/book/create", bookController.bookCreatePost);

// deleting book
router.get("/book/:id/delete", bookController.bookDeleteGet);
router.post("/book/:id/delete", bookController.bookDeletePost);

// update book
router.get("/book/:id/update", bookController.bookUpdateGet);
router.post("/book/:id/update", bookController.bookUpdatePost);

// display single book
router.get("/book/:id", bookController.bookDetail);

// all books display
router.get("/books", bookController.bookList);

// Genre Routes
router.get("/genre/create", genreController.genreCreateGet);
router.post("/genre/create", genreController.genreCreatePost);
router.get("/genre/:id/delete", genreController.genreDeleteGet);
router.post("/genre/:id/delete", genreController.genreDeletePost);
router.get("/genre/:id/update", genreController.genreUpdateGet);
router.post("/genre/:id/update", genreController.genreUpdatePost);
router.get("/genre/:id", genreController.genreDetail);
router.get("/genres", genreController.genreList);

// BookInstance Routes
router.get(
  "/bookInstance/create",
  bookInstanceController.bookInstanceCreateGet
);
router.post(
  "/bookInstance/create",
  bookInstanceController.bookInstanceCreatePost
);
router.get(
  "/bookInstance/:id/delete",
  bookInstanceController.bookInstanceDeleteGet
);
router.post(
  "/bookInstance/:id/delete",
  bookInstanceController.bookInstanceUpdatePost
);
router.get(
  "/bookInstance/:id/update",
  bookInstanceController.bookInstanceUpdateGet
);
router.post(
  "/bookInstance/:id/update",
  bookInstanceController.bookInstanceUpdatePost
);
router.get("/bookInstance/:id", bookInstanceController.bookInstanceDetail);
router.get("/bookInstances", bookInstanceController.bookInstanceList);

// author routes
router.get("/author/create", authorController.authorCreateGet);
router.post("/author/create", authorController.authorCreatePost);
router.get("/author/:id/delete", authorController.authorDeleteGet);
router.post("/author/:id/delete", authorController.authorDeletePost);
router.get("/author/:id/update", authorController.authorUpdateGet);
router.post("/author/:id/update", authorController.authorUpdatePost);
router.get("/author/:id", authorController.authorDetail);
router.get("/authors", authorController.authorList);

module.exports = router;
