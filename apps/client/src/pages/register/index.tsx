import {
  AutoSignIn,
  ConfirmEmail,
  formStateReducer,
  initialState,
  Register,
} from "@/components/Register";
import React, { useReducer } from "react";
import { match } from "ts-pattern";

const RegisterPage = () => {
  const [formState, dispatch] = useReducer(formStateReducer, initialState);

  return match(formState.step)
    .with("init", () => <Register formState={formState} dispatch={dispatch} />)
    .with("emailValidation", () => (
      <ConfirmEmail formState={formState} dispatch={dispatch} />
    ))
    .with("autoSignIn", () => <AutoSignIn />)
    .exhaustive();
};

export default RegisterPage;
