import { FC, useState } from "react";
import { confirmationFormStateSchema, FormProps } from "./types";
import { CardContent, InputGroup, Input, FormErrors } from "@/components/ui";
import { FormattedZodErrors, formatZodErrors } from "@/lib";
import { Card, Label, Button } from "@aws-amplify/ui-react";
import { confirmSignUp } from "aws-amplify/auth";

export const ConfirmEmail: FC<FormProps> = ({
  dispatch,
  formState: { email, confirmationCode },
}) => {
  const [errors, setErrors] = useState<FormattedZodErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    const { error } = confirmationFormStateSchema.safeParse({
      email,
      confirmationCode,
    });

    if (error) {
      setErrors(formatZodErrors(error));
      return;
    }

    try {
      const { nextStep } = await confirmSignUp({
        confirmationCode,
        username: email,
      });

      if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        dispatch({ type: "confirmationCompleted" });
      }
    } catch (e) {
      if (e instanceof Error) {
        setErrors({ form: [e.message] });
      }
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
              <Label htmlFor="confirmation-code">Confirmation Code*</Label>
              <Input
                id="confirmation-code"
                type="text"
                value={confirmationCode}
                onChange={(e) =>
                  dispatch({
                    type: "confirmationCodeChanged",
                    payload: e.target.value,
                  })
                }
                hasError={!!errors?.["confirmationCode"]}
              />
              {errors?.["confirmationCode"] && (
                <FormErrors errors={errors["confirmationCode"]} />
              )}
            </InputGroup>

            <Button type="submit" className="w-full">
              Confirm
            </Button>

            {errors?.["form"] && <FormErrors errors={errors["form"]} />}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
