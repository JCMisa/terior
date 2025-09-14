import axios from "axios";
import type { AxiosError } from "axios";

export const api = axios.create({ baseURL: "/api", timeout: 80000 });

/* narrow errors to our shape */
export function getAxiosError(err: AxiosError<{ error?: string }>): string {
  return err.response?.data?.error ?? err.message ?? "Network error";
}
