import css from "./App.module.css";
import movieService from "../../services/movieService.ts";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar.tsx";
import { toast, Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleMovieSelect = (movie: Movie) => {
    setMovie(movie);
  };
  const handleCloseModal = () => {
    setMovie(null);
  };
  const handleSearch = async (query: string): Promise<void> => {
    setLoading(true);
    try {
      const results = await movieService(query);

      if (results.length === 0) {
        setIsError(true);
        toast.error("No movies found for your request.\n");
        setMovies([]);
        return;
      }
      setIsError(false);
      setMovies(results);
    } catch (error) {
      setIsError(true);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. \n";
      toast.error(errorMessage);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid movies={movies} onSelect={handleMovieSelect} />
      {movie && <MovieModal movie={movie} onClose={handleCloseModal} />}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fffdfd",
            color: "#1e1d1d",
            cursor: "pointer",
          },
        }}
      />
    </div>
  );
}
