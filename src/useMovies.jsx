import { useEffect, useState } from "react";
const Key = "a5ae5830";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState("");

  useEffect(
    function () {
      // callback?.();
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
      // handleCloseMovie();
      fetchMovies();
      //NOTE:disini juga hrus pake buat ngurangin fetch
      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return { movies, isLoading, error };
}
