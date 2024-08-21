import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { signUp, confirmSignUp, autoSignIn } from "aws-amplify/auth";
import { useRouter } from "next/router";

type Props = {
  setStep: React.Dispatch<
    React.SetStateAction<"init" | "emailValidation" | "autoSignIn">
  >;
};

const RegistrationForm: FC<Props> = ({ setStep }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (
          !email.length ||
          !password.length ||
          !passwordConfirm.length ||
          password !== passwordConfirm
        ) {
          alert("Invalid form");
          return;
        }

        try {
          const { nextStep } = await signUp({
            password,
            username: email,
            options: {
              userAttributes: { email },
              autoSignIn: true,
            },
          });

          if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
            setStep("emailValidation");
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password-confirm">Password Confirmation</label>
        <input
          id="password-confirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>

      <button type="submit">Sign Up</button>

      <Link href={"user"}>Sign In</Link>
    </form>
  );
};

const ValidateEmailForm: FC<Props> = ({ setStep }) => {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (!confirmationCode.length || !email.length) {
          alert("Invalid form");
          return;
        }

        try {
          const { nextStep } = await confirmSignUp({
            confirmationCode,
            username: email,
          });

          if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
            setStep("autoSignIn");
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="confirmation-code">Confirmation Code</label>
        <input
          id="confirmation-code"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
      </div>
      <button type="submit">Confirm</button>
    </form>
  );
};

const AutoSignIn: FC = () => {
  const router = useRouter();

  useEffect(() => {
    autoSignIn()
      .then(({ nextStep }) => {
        if (nextStep.signInStep === "DONE") {
          router.push("/");
        }
      })
      .catch((e) => console.error(e));
  }, [router]);

  return null;
};

const RegisterPage = () => {
  const [step, setStep] = useState<"init" | "emailValidation" | "autoSignIn">(
    "init"
  );

  if (step === "init") return <RegistrationForm setStep={setStep} />;
  if (step === "emailValidation")
    return <ValidateEmailForm setStep={setStep} />;
  if (step === "autoSignIn") return <AutoSignIn />;

  return null;
};

export default RegisterPage;
