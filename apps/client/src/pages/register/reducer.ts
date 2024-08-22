import { match } from "ts-pattern";
import { Action, FormState } from "./types";

export const initialState: FormState = {
  step: "init",
  email: "",
  password: "",
  passwordConfirm: "",
  confirmationCode: "",
};

export const formStateReducer = (
  state: FormState,
  action: Action
): FormState => {
  return match(action)
    .with({ type: "emailChanged" }, ({ payload }) => ({
      ...state,
      email: payload,
    }))
    .with({ type: "passwordChanged" }, ({ payload }) => ({
      ...state,
      password: payload,
    }))
    .with({ type: "paswordConfirmChanged" }, ({ payload }) => ({
      ...state,
      passwordConfirm: payload,
    }))
    .with({ type: "confirmationCodeChanged" }, ({ payload }) => ({
      ...state,
      confirmationCode: payload,
    }))
    .with({ type: "registrationCompleted" }, () => ({
      ...state,
      step: "emailValidation" as const,
    }))
    .with({ type: "confirmationCompleted" }, () => ({
      ...state,
      step: "autoSignIn" as const,
    }))
    .exhaustive();
};
