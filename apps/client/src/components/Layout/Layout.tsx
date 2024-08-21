import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <nav className="flex gap-2 py-5 px-10 underline">
        <Link href={"/"}>Home</Link>
        <Link href={"user"}>User</Link>
        <Link href={"register"}>Register</Link>
      </nav>

      <main>{children}</main>
    </>
  );
}
