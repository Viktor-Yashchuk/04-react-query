import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import css from './App.module.css';
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import type { Movie } from "../../types/movie";
import { fetchMovies, type FetchMoviesResponse } from "../../services/movieService";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";

export default function App() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError, isFetched } = useQuery<FetchMoviesResponse>({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: !!query.trim(),
        placeholderData: (prev: FetchMoviesResponse | undefined) => {
            return page > 1 ? prev : undefined; },
    });

    const { results: movies = [], total_pages: totalPages = 0 } = data ?? {};

    useEffect(() => {
        if (!query.trim()) return;
        if (isFetched && !isLoading && movies.length === 0) {
            toast.error('No movies found for your request.');
        }
    }, [isFetched, isLoading, movies, query]);

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        setPage(1);
        setSelectedMovie(null);
    };

    return (
        <div className={css.app}>
            <SearchBar onSubmit={handleSearch} />
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {movies.length > 0 && (
                <>
                    {totalPages > 1 && (<ReactPaginate
                        pageCount={totalPages}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={1}
                        onPageChange={({ selected }) => setPage(selected + 1)}
                        forcePage={page - 1}
                        containerClassName={css.pagination}
                        activeClassName={css.active}
                        nextLabel="→"
                        previousLabel="←"                        
                    />)}
                    <MovieGrid movies={movies} onSelect={setSelectedMovie} />
                </>
            )}
            {selectedMovie && (<MovieModal movie={selectedMovie} onClose={ () => setSelectedMovie(null)} />)}
        </div>
    );
}