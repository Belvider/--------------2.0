export function getRequestError(error: unknown, fallback = "Не вдалося виконати запит. Спробуйте ще раз.") {
  if (error instanceof SyntaxError) return "Сервер повернув некоректну відповідь. Спробуйте ще раз.";
  if (error instanceof TypeError) return "Немає зв’язку із сервером. Перевірте інтернет і спробуйте ще раз.";
  return error instanceof Error && error.message ? error.message : fallback;
}

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new Error("Немає зв’язку із сервером. Перевірте інтернет і спробуйте ще раз.");
  }

  let data: unknown;
  try {
    data = response.status === 204 ? {} : await response.json();
  } catch {
    throw new Error("Сервер повернув некоректну відповідь. Спробуйте ще раз.");
  }

  if (!response.ok) {
    const serverError = data && typeof data === "object" && "error" in data ? data.error : undefined;
    throw new Error(typeof serverError === "string" ? serverError : "Не вдалося виконати запит. Спробуйте ще раз.");
  }
  return data as T;
}
