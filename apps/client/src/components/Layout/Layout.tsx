import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppNavigation } from "../AppNavigation";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-col min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <AppNavigation />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
        {children}
      </main>
    </div>
  );
}
