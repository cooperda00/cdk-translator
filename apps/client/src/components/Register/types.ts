import { Dispatch } from "react";
import { z } from "zod";

export type Step = "init" | "emailValidation" | "autoSignIn";

export type FormState = {
  step: Step;
  email: string;
  password: string;
  passwordConfirm: string;
  confirmationCode: string;
};

export type Action =
  | { type: "emailChanged"; payload: string }
  | { type: "passwordChanged"; payload: string }
  | { type: "paswordConfirmChanged"; payload: string }
  | { type: "confirmationCodeChanged"; payload: string }
  | { type: "registrationCompleted" }
  | { type: "confirmationCompleted" };

export type FormProps = {
  formState: FormState;
  dispatch: Dispatch<Action>;
};

export const registerFormStateSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[\^\$\*\.\[\]\{\}\(\)\?\"\!\@\#\%\&\/\\\,\>\<\'\:\;\|\_\~\`\=\+\-]/,
        "Password must contain at least one special character"
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const confirmationFormStateSchema = z.object({
  email: z.string().email(),
  confirmationCode: z.string().length(6),
});
