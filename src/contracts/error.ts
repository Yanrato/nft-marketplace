export interface ApiError {
  code:
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "TRANSIENT_ERROR";
  message: string;
  fields?: Record<string, string>; // erro por campo de formulário
}