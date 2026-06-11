"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  return (
    <div>
      Navbar
      {isSignedIn ? (
        <>
          <Link href={"/dashboard"}>dashboard</Link>
        </>
      ) : (
        <>Login</>
      )}
    </div>
  );
};

export default Navbar;
