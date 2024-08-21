import { Languages } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { Logout } from "../Logout";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex-1 gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Languages className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                href="login"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="register"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && <Logout className={"md:ml-auto"} />}
        </nav>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
        {children}
      </main>
    </div>
  );
}
