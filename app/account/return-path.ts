/** Authentication may return to the browser app, never to a caller-supplied URL. */
export function accountReturnPath(search: string): "/control" | undefined {
  const values = new URLSearchParams(search).getAll("returnTo");
  return values.length === 1 && values[0] === "control" ? "/control" : undefined;
}
