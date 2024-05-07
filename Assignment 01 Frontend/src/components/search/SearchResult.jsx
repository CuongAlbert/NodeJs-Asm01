import React, { useState, useEffect } from "react";

import axios from "../../utils/axios";
import requests from "../../utils/requests";

import "./SearchResult.css";
import userToken from "../../utils/userToken";

const base_url = "https://image.tmdb.org/t/p/original";

const SearchResult = ({ query }) => {
  const [movies, setMovies] = useState([]);

  const url = `${requests.fetchSearch}?`;

  useEffect(() => {
    async function fetchData() {
      const request = await axios.post(
        requests.fetchSearch,
        {
          keyword: query.keyword,
          genre: query.genre,
          language: query.language,
          mediaType: query.mediaType,
          year: query.year,
        },
        {
          headers: {
            Authorization: userToken.user1.token,
          },
        }
      );
      setMovies(request.data.results);
      return request;
    }

    if (query) {
      fetchData();
    } else {
      setMovies([]);
    }
  }, [url, query]);

  if (movies.length === 0) {
    return (
      <div className="row">
        <h2>Search Result</h2>
        <h1 style={{ color: "red" }}>No movie has founded</h1>
      </div>
    );
  }

  return (
    <div className="row">
      <h2>Search Result</h2>
      <div className="row_posters search-resul-container sc2">
        {movies.map((movie) => {
          return (
            <img
              key={movie.id}
              className={`row_poster row_posterLarge`}
              src={`${base_url}${movie.poster_path}`}
              alt={movie.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;
