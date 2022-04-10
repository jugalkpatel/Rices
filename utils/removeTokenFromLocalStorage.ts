export default function removeTokenFromLocalStorage(): void {
  if (typeof window !== "undefined") {
    localStorage?.removeItem("rices");
  }
}
