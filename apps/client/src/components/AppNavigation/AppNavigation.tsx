import { Languages } from "lucide-react";
import Link from "next/link";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { Logout } from "../Logout";
import { History } from "@/components/History";
import { useRouter } from "next/router";
import { Button } from "../ui";

export const AppNavigation = () => {
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex-1 gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={isLoggedIn ? "/" : "login"}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Languages className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>

        {!isLoggedIn && (
          <div>
            <Button
              variant={"link"}
              onClick={() => {
                router.push("login");
              }}
            >
              Login
            </Button>

            <Button
              variant={"link"}
              onClick={() => {
                router.push("register");
              }}
            >
              Register
            </Button>
          </div>
        )}

        {isLoggedIn && (
          <div className={"md:ml-auto flex"}>
            <History />
            <Logout />
          </div>
        )}
      </nav>
    </header>
  );
};
