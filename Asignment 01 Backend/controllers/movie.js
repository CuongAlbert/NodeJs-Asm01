const Genre = require("../models/Genre");
const Movies = require("../models/Movies");
const Video = require("../models/Video");
const paging = require("../utils/paging");

const PAGE_SIZE = 20;

// get all movies in movieList
const movies = Movies.all();

exports.getMoviesAll = (req, res, next) => {
  const page = req.query.page || 1;
  const results = paging(movies, PAGE_SIZE, page);
  const totalPages = Math.ceil(movies.length / PAGE_SIZE);
  console.log(results);
  return res.status(200).json({
    results,
    page,
    total_pages: totalPages,
  });
};

exports.getMoviesTrending = (req, res, next) => {
  // get page query
  const page = req.query.page || 1;
  const result = getListMovieByKey(page, "popularity");
  return res.status(200).json(result);
};

exports.getMoviesTopRate = (req, res, next) => {
  // get page query
  const page = req.query.page || 1;
  return res.status(200).json(getListMovieByKey(page, "vote_average"));
};

exports.getMoviesDiscover = (req, res, next) => {
  const genres = Genre.all();
  // get page query
  const page = req.query.page || 1;
  const id = +req.query.genre;
  if (!id) {
    return res.status(400).json({ message: "Not found genre param" });
  }

  // find genre in genreList with id
  const existGenre = genres.find((g) => g.id === id);
  if (!existGenre) {
    return res.status(400).json({ message: "Not found that genre id" });
  }

  // filter movie has genreId includes id
  const genreMovies = movies.filter((m) => m["genre_ids"].includes(id));

  const results = paging(genreMovies, PAGE_SIZE, page);
  const totalPages = Math.ceil(genreMovies.length / PAGE_SIZE);

  return res.status(200).json({
    results,
    page,
    total_pages: totalPages,
    genre_name: existGenre.name,
  });
};

exports.postMovies = (req, res, next) => {
  const videos = Video.all();
  //get film id
  const id = req.body.film_id;
  if (!id) {
    return res.status(400).json({ message: "Not found film_id param" });
  }

  // find video in videoList with id
  const filmVideo = videos.find((g) => g.id === id);
  if (!filmVideo) {
    return res.status(404).json({ message: "Not found video" });
  }

  // filter video
  const results = filmVideo.videos
    .filter((v) => v.official)
    .filter((v) => v.site === "YouTube")
    .filter((v) => v.type === "Trailer" || v.type === "Teaser")
    .sort((a, b) => (a.type > b.type ? -1 : a.type < b.type ? 1 : 0))
    .sort((a, b) => b.published_at - a.published_at);

  if (results.length === 0) {
    return res.status(404).json({ message: "Not found video" });
  }
  return res.status(200).json({
    results: results[0],
  });
};

exports.postSearchMovies = (req, res, next) => {
  const genres = Genre.all();
  const page = req.query.page || 1;
  let { keyword, genre, mediaType, language, year } = req.body;

  keyword = keyword ? keyword.toLowerCase() : keyword;
  genre = genre ? genre.toLowerCase() : genre;
  mediaType = mediaType ? mediaType.toLowerCase() : mediaType;
  language = language ? language.toLowerCase() : language;
  year = year ? +year : year;

  console.log(keyword, genre, language, mediaType, year);

  if (!keyword) {
    return res.status(400).json({ message: "Not found keyword param" });
  }

  const searchMovies = movies.filter((m) => {
    const names = m.genre_ids
      .map((id) => genres.find((g) => g.id === id))
      .filter(Boolean)
      .map((g) => g.name.toLowerCase());

    return (
      (m.overview?.toLowerCase().includes(keyword) ||
        m.title?.toLowerCase().includes(keyword)) &&
      (!language || m.original_language?.toLowerCase().includes(language)) &&
      (!mediaType || m.media_type?.toLowerCase().includes(mediaType)) &&
      (!year || new Date(m.release_date)?.getFullYear() === year) &&
      (!genre || names.find((n) => n.includes(genre)))
    );
  });

  const results = paging(searchMovies, PAGE_SIZE, page);
  const totalPages = Math.ceil(searchMovies.length / PAGE_SIZE);

  return res.status(200).json({
    results,
    page,
    total_pages: totalPages,
  });
};

// create utils reused
const getListMovieByKey = (page, key) => {
  // sort array movies by key desc
  const sortedMovies = movies.sort((mA, mB) => mB[key] - mA[key]);
  const results = paging(sortedMovies, PAGE_SIZE, page);

  // calculate total page
  const totalPages = Math.ceil(movies.length / PAGE_SIZE);

  return {
    results,
    page,
    total_pages: totalPages,
  };
};
