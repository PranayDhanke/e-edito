import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = () => {
  return (
    <div className="flex w-full justify-between p-10">
      <div>
        <p>create room</p>

        <Link href="/dashboard/create-room">
          create room button
        </Link>
      </div>
      <div>my rooms</div>
    </div>
  );
};

export default page;
