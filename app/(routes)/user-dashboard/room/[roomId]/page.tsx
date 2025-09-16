import NotPublic from "@/components/custom/NotPublic";
import { Compare } from "@/components/ui/compare";
import { getRoom } from "@/lib/actions/rooms";
import { getCurrentUser } from "@/lib/actions/users";
import { notFound, redirect } from "next/navigation";
import EditRoomName from "./_components/EditRoomName";
import TabsSection from "./_components/TabsSection";

interface RoomDetailsProps {
  params: {
    roomId: string;
  };
}

const RoomDetails = async ({ params }: RoomDetailsProps) => {
  try {
    const roomId = Number(params.roomId);
    if (!Number.isFinite(roomId)) notFound();

    const [userRes, roomRes] = await Promise.all([
      getCurrentUser(),
      getRoom(roomId),
    ]);

    if (!userRes.success || !userRes.data) {
      redirect("/sign-in");
    }

    if (!roomRes.success || !roomRes.data) {
      notFound();
    }

    const user = userRes.data;
    const room = roomRes.data;

    if (user.role !== "admin") {
      if (!room.public && room.createdBy !== user.email) {
        return <NotPublic />;
      }
    }

    return (
      <div className="flex flex-col items-center ">
        <div className="flex items-start">
          <h1 className="text-6xl font-bold tracking-wider">{room.roomName}</h1>
          {(room.createdBy === user.email || user.role === "admin") && (
            <EditRoomName roomId={roomId} currentName={room.roomName} />
          )}
        </div>
        <div className="z-10 relative flex h-[800px] w-full items-center justify-center px-1 [transform-style:preserve-3d] md:px-8 -mt-10">
          <div className="absolute inset-0 h-full w-full scale-[0.70] transform rounded-lg bg-gradient-to-r from-[#ff8f66] to-[#ff6d3d] blur-3xl" />
          <div
            style={{
              transform: "rotateX(15deg) translateZ(80px)",
            }}
            className="mx-auto h-1/2 w-3/4 rounded-3xl border border-neutral-200 bg-neutral-100 p-1 md:h-3/4 md:p-4 dark:border-neutral-800 dark:bg-neutral-900 "
          >
            <Compare
              firstImage={room.originalImageUrl || "/not-designed.png"}
              secondImage={room.redesignedImageUrl || "/designed.png"}
              firstImageClassName="object-cover object-center w-full"
              secondImageClassname="object-cover object-center w-full"
              className="h-full w-full rounded-[22px] md:rounded-lg"
              slideMode="drag"
              autoplay={false}
            />
          </div>
        </div>

        <TabsSection
          room={room}
          canEdit={room.createdBy === user.email || user.role === "admin"}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load room data:", error);
    return <div>Error loading room data.</div>;
  }
};

export default RoomDetails;
