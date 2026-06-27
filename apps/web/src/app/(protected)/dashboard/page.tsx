"use client";
import { useGetMe } from "@/api/hooks/auth/getMe";
import { useGetUser } from "@/api/hooks/auth/getUser";
import { useGetMyRoom } from "@/api/hooks/room/getMyRoom";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Room } from "@repo/validation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const page = () => {
  const { data, isLoading, error } = useGetMyRoom();

  if (error) {
    <>{error.message}</>;
  }

  if (isLoading) {
    return "loading....";
  }
  return (
    <div>
      <div className=" flex justify-center w-full mx-auto"></div>
      <div className="flex w-full justify-between p-10">
        <div>
          <p>create room</p>

          <Link href="/dashboard/create-room">create room button</Link>
        </div>
        <div>
          my rooms
          {data.rooms.map((room: Room) => {
            return (
              <div key={room._id}>
                name : {room.name} <br />
                desc : {room.description} <br />
                room code : {room.room_code} <br />
                language : {room.language} <br />
                status : {room.status} <br />
                <Link className="bg-red-500" href={`/dashboard/workspace/${room.room_code}?role=owner`}>Go to the room</Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
