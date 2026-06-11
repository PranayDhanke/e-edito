"use client";
import { useGetMe } from "@/api/hooks/auth/getMe";
import { useGetUser } from "@/api/hooks/auth/getUser";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = () => {
  const { data, isLoading, error } = useGetMe();

  if (error) {
    console.log(error);
  }

  
  if (isLoading) {
    return "loading....";
  }
  
  console.log(data.data);
  return (
    <div>
      <div className=" flex justify-center w-full mx-auto"></div>
      <div className="flex w-full justify-between p-10">
        <div>
          <p>create room</p>

          <Link href="/dashboard/create-room">create room button</Link>
        </div>
        <div>my rooms</div>
      </div>
    </div>
  );
};

export default page;
