import { ZodError } from "zod";

export type FormattedZodErrors = Record<string, string[]>;

export function formatZodErrors(error: ZodError): FormattedZodErrors {
  const formattedErrors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (formattedErrors[path]) {
      formattedErrors[path] = [...formattedErrors[path], err.message];
    } else {
      formattedErrors[path] = [err.message];
    }
  });

  return formattedErrors;
}
