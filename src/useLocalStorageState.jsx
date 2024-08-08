import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  //NOTE: manggil local storager browser
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);

    //NOTE: ubah dri string ke Json lagi
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  //NOTE: nyimpen di local storage browser
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key],
  );

  return [value, setValue];
}
