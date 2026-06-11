import { QueryProvider } from "@/providers/tanstack-provider";
import { SocketProvider } from "@/socket/socket-provider";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SocketProvider>
        <QueryProvider>{children}</QueryProvider>
      </SocketProvider>
    </main>
  );
}
