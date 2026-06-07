"use client";

import { SessionProvider } from "next-auth/react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <main className="flex-1">{children}</main>
    </SessionProvider>
  );
}
