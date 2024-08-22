import React, { useReducer } from "react";
import { match } from "ts-pattern";
import { AutoSignIn } from "./AutoSignIn";
import { ConfirmEmail } from "./ConfirmEmail";
import { Register } from "./Register";
import { formStateReducer, initialState } from "./reducer";

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
