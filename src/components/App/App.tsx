import css from "./App.module.css";
import movieService from "../../services/movieService.ts";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar.tsx";
import { toast, Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleMovieSelect = (movie: Movie) => {
    setMovie(movie);
  };
  const handleCloseModal = () => {
    setMovie(null);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movieId", query, page],
    queryFn: async () => await movieService(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  const handleSearch = (query: string): void => {
    setQuery(query);

    // setLoading(true);
    // try {
    //   const results = await movieService(query);
    //
    //   if (results.length === 0) {
    //     setIsError(true);
    //     toast.error("No movies found for your request.\n");
    //     setMovies([]);
    //     return;
    //   }
    //   setIsError(false);
    //   setMovies(results);
    // } catch (error) {
    //   setIsError(true);
    //   const errorMessage =
    //     error instanceof Error
    //       ? error.message
    //       : "An unexpected error occurred. \n";
    //   toast.error(errorMessage);
    //   setMovies([]);
    // } finally {
    //   setLoading(false);
    // }
  };
  useEffect(() => {
    if (data?.results?.length === 0) {
      toast.error("No movies found for your request.\n");
    }
  }, [data]);
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {data && data.results.length > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && <MovieGrid movies={data.results} onSelect={handleMovieSelect} />}
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
