import { FormErrors, Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputGroup } from "@/components/ui/InputGroup";
import { Label } from "@/components/ui/Label";
import { FormattedZodErrors, formatZodErrors } from "@/lib";
import { signIn } from "aws-amplify/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import z from "zod";

const formStateSchema = z.object({
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
});

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormattedZodErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    const { error } = formStateSchema.safeParse({ email, password });

    if (error) {
      setErrors(formatZodErrors(error));
      return;
    }

    try {
      await signIn({
        username: email,
        password,
        options: {
          clientMetadata: { email },
        },
      });

      router.push("/");
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
                onChange={(e) => setEmail(e.target.value)}
              />

              {errors?.["email"] && <FormErrors errors={errors["email"]} />}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors?.["password"] && (
                <FormErrors errors={errors["password"]} />
              )}
            </InputGroup>

            <div className="flex gap-2 justify-center flex-row-reverse">
              <Button type="submit" className="flex-1">
                Login
              </Button>

              <Button
                type="button"
                variant={"link"}
                onClick={() => {
                  router.push("register");
                }}
                className="flex-1"
              >
                Register
              </Button>
            </div>

            {errors?.["form"] && <FormErrors errors={errors["form"]} />}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
