import axios from "axios";

/** base url to make request to the themoviedatabase */

const instance = axios.create({
  // baseURL: "https://api.themoviedb.org/3",
  baseURL: "http://localhost:8080/api/movies/",
});

// instance.get('/foo-bar');
// https://api.themoviedb.org/3/foo-bar

export default instance;
