import { FC, useState } from "react";
import { FormProps, registerFormStateSchema } from "./types";
import {
  CardContent,
  InputGroup,
  FormErrors,
  Card,
  Label,
  Button,
  Input,
} from "@/components/ui";
import { FormattedZodErrors, formatZodErrors } from "@/lib";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/router";

export const Register: FC<FormProps> = ({
  formState: { email, password, passwordConfirm },
  dispatch,
}) => {
  const router = useRouter();

  const [errors, setErrors] = useState<FormattedZodErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    setErrors({});

    const { error } = registerFormStateSchema.safeParse({
      email,
      password,
      passwordConfirm,
    });

    if (error) {
      setErrors(formatZodErrors(error));
      setLoading(false);
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
        dispatch({ type: "registrationCompleted" });
      }
    } catch (e) {
      if (e instanceof Error) {
        setErrors({ form: [e.message] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1">
      <Card>
        <CardContent className="pt-6">
          <form className="w-80 flex flex-col gap-3" onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  dispatch({ type: "emailChanged", payload: e.target.value })
                }
                hasError={!!errors?.["email"]}
              />
              {errors?.["email"] && <FormErrors errors={errors["email"]} />}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  dispatch({ type: "passwordChanged", payload: e.target.value })
                }
                hasError={!!errors?.["password"]}
              />
              {errors?.["password"] && (
                <FormErrors errors={errors["password"]} />
              )}
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password-confirm">Re-type Password*</Label>
              <Input
                id="password-confirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) =>
                  dispatch({
                    type: "paswordConfirmChanged",
                    payload: e.target.value,
                  })
                }
                hasError={!!errors?.["passwordConfirm"]}
              />
              {errors?.["passwordConfirm"] && (
                <FormErrors errors={errors["passwordConfirm"]} />
              )}
            </InputGroup>

            <div className="flex gap-2 justify-center flex-row-reverse">
              <Button type="submit" className="flex-1" disabled={loading}>
                Register
              </Button>

              <Button
                type="button"
                variant={"link"}
                className="flex-1"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </Button>
            </div>

            {errors?.["form"] && <FormErrors errors={errors["form"]} />}
          </form>

          <Button
            variant={"link"}
            className="mt-4 p-0 w-full text-sm"
            onClick={() => dispatch({ type: "registrationCompleted" })}
          >
            Need to enter a confirmation code?
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
