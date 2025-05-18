import { AxiosError } from "axios";

function errorHandler(err: unknown): string {
  if (err instanceof AxiosError) {
    if (err.response) {
      console.error("Error response:", err.response.data);
      console.error("Error status:", err.response.status);
      console.error("Error headers:", err.response.headers);
      return err.response.data.message || "An error occurred";
    }
  }
  return "An unexpected error occurred";
}

export default errorHandler;
