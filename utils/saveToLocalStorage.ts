export default function saveToLocalStorage(key: string, value: string) {
  if (typeof window !== "undefined") {
    localStorage?.setItem(key, JSON.stringify(value));

    return true;
  }

  return false;
}
