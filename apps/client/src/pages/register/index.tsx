import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { signUp, confirmSignUp, autoSignIn } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui";

// TODO - form state / validation with react-hook-form

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
    <div className="flex items-center justify-center flex-1">
      <form
        className="w-80 flex flex-col gap-3"
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
        <InputGroup>
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">Password*</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password-confirm">Re-type Password*</Label>
          <Input
            id="password-confirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </InputGroup>

        <div className="flex gap-2 justify-center flex-row-reverse">
          <Button type="submit" className="flex-1">
            Register
          </Button>

          <Button type="button" variant={"outline"} className="flex-1">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

const ValidateEmailForm: FC<Props> = ({ setStep }) => {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  return (
    <div className="flex items-center justify-center flex-1">
      <form
        className="w-80 flex flex-col gap-3"
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
        <InputGroup>
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="confirmation-code">Confirmation Code*</Label>
          <Input
            id="confirmation-code"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
        </InputGroup>

        <Button type="submit" className="w-full">
          Confirm
        </Button>
      </form>
    </div>
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
