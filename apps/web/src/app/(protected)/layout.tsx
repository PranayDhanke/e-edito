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
      <QueryProvider>
        <SocketProvider>{children}</SocketProvider>
      </QueryProvider>
    </main>
  );
}
