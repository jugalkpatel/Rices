function fetchFromLocalStorage(key: string): any {
  if (typeof window !== "undefined") {
    const value = localStorage?.getItem(key);

    return value ? JSON.parse(value) : undefined;
  }

  return undefined;
}

export { fetchFromLocalStorage };
