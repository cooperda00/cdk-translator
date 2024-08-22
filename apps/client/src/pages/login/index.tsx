import { Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputGroup } from "@/components/ui/InputGroup";
import { Label } from "@/components/ui/Label";
import { signIn } from "aws-amplify/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

// TODO - form state / validation with react-hook-form

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center flex-1">
      <Card>
        <CardContent className="pt-6">
          <form
            className="w-80 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!email.length || !password.length) {
                alert("Incorrect form");
              }

              await signIn({
                username: email,
                password,
                options: {
                  clientMetadata: { email },
                },
              });

              router.push("/");
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

            <div className="flex gap-2 justify-center flex-row-reverse">
              <Button type="submit" className="flex-1">
                Login
              </Button>

              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  router.push("register");
                }}
                className="flex-1"
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
