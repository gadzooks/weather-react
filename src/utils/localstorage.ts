import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: any): any {
  // getting stored value
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
  return null;
}

function useLocalStorage(key: string, defaultValue: any) {
  const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    // storing input name
    // console.log(`setting value localstorage : ${value}`);
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
