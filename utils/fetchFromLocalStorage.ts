function fetchFromLocalStorage(key: string): any {
  if (typeof window !== "undefined") {
    return localStorage.getItem(JSON.parse(key));
  }

  return undefined;
}

export { fetchFromLocalStorage };
