import axios from "axios";
import type { Movie } from "../types/movie.ts";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

interface MovieResponse {
  results: Movie[];
}

export default async function movieService(query: string): Promise<Movie[]> {
  const response = await axios.get<MovieResponse>(BASE_URL, {
    params: {
      query: query,
      language: "en-US",
      include_adult: "false",
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  return response.data.results;
}
