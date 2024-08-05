import { useEffect, useState } from "react";
import MovieDetails from "./Components/MovieDetails";
import Loader from "./Components/Loader";
import WatchedSummary from "./Components/WatchedSummary";
import WatchedMoviesList from "./Components/WatchedMoviesList";

const Key = "a5ae5830";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      //NOTE:buat ngurangin fetch
      const controller = new AbortController();

      //NOTE: buat fetch movies
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setIsError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
            //NOTE: disini juga hrus ditambahin
            { signal: controller.signal },
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching Movies");

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not found🥲");
          }

          setMovies(data.Search);
          setIsError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") setIsError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      //NOTE:: buat biar ga search kalau hurufnya dibawah 3
      if (query.length < 3) {
        setMovies([]);
        setIsError("");
        return;
      }

      //NOTE: pastiin movie details tutup dulu baru kita search
      handleCloseMovie();
      fetchMovies();
      //NOTE:disini juga hrus pake buat ngurangin fetch
      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessages message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                onDeleteWatched={handleDeleteMovie}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessages({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
