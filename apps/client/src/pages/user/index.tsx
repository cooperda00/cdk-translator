import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";

type LoginProps = {
  onSignedIn: () => void;
};

const Login: FC<LoginProps> = ({ onSignedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
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

        onSignedIn();
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

      <button type="submit">Sign In</button>

      <Link href={"register"}>Register</Link>
    </form>
  );
};

type LogoutProps = {
  onSignedOut: () => void;
};

const Logout: FC<LogoutProps> = ({ onSignedOut }) => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signOut();
        onSignedOut();
      }}
    >
      <button type="submit">Logout</button>
    </form>
  );
};

const UserPage = () => {
  const [status, setStatus] = useState<"idle" | "loggedIn" | "loggedOut">(
    "idle"
  );

  useEffect(() => {
    getCurrentUser()
      .then(({ userId }) => {
        if (userId) {
          setStatus("loggedIn");
        }
      })
      .catch((e) => {
        setStatus("loggedOut");
      });
  });

  if (status === "idle") {
    return null;
  }

  if (status === "loggedOut") {
    return <Login onSignedIn={() => setStatus("loggedIn")} />;
  }

  if (status === "loggedIn") {
    return <Logout onSignedOut={() => setStatus("loggedOut")} />;
  }

  return null;
};

export default UserPage;
