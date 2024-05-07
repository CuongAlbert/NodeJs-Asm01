const express = require("express");

const movieController = require("../controllers/movie");

const router = express.Router();

router.get("/", movieController.getMoviesAll);

router.get("/trending", movieController.getMoviesTrending);

router.get("/top-rate", movieController.getMoviesTopRate);

router.get("/discover", movieController.getMoviesDiscover);

router.post("/video", movieController.postMovies);

router.post("/search", movieController.postSearchMovies);

module.exports = router;
