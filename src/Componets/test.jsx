function Watchedmovieslist() {
  function WatchedMoviesList({ watched }) {
    return (
      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovie movie={movie} key={movie.imdbID} />
        ))}
      </ul>
    );
  }
}
