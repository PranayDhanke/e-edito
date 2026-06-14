import RoomWorkspace from "@/components/rooms/RoomWorkspace";

export default async function Page({
  params,
}: {
  params: Promise<{
    roomId: string[];
  }>;
}) {
  const { roomId } = await params;
  const roomCode = roomId[0] ?? "";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,247,237,0.75),rgba(248,250,252,0.95))] px-4 py-6 md:px-6 lg:px-8">
      <RoomWorkspace roomCode={roomCode} />
    </div>
  );
}
