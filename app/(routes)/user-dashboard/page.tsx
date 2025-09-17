import { BanknoteArrowUp, LayoutGrid, TrendingUp } from "lucide-react";
import DataCard from "./_components/DataCard";
import CreateForm from "./_components/CreateForm";
import { getUserCredits } from "@/lib/actions/users";
import { getUserRooms } from "@/lib/actions/rooms";

export default async function UserDashboard() {
  const [userCreditsRes, userRoomsRes] = await Promise.all([
    getUserCredits(),
    getUserRooms(),
  ]);

  let userCredits;
  let userRooms;

  if (!userCreditsRes.data && !userCreditsRes.success) {
    userCredits = "0";
  }
  if (!userRoomsRes.data && !userRoomsRes.success) {
    userRooms = "0";
  }

  userCredits = userCreditsRes.data?.toString();
  userRooms = (userRoomsRes.data?.length || 0).toString();

  const latestRoomDesign = userRoomsRes.latest;

  return (
    <div className="flex flex-col gap-4 p-4">
      <CreateForm />

      {/* data cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <DataCard
          label="Remaining Credits"
          value={userCredits as string}
          Icon={BanknoteArrowUp}
        />
        <DataCard
          label="Rooms Redesigned"
          value={userRooms}
          Icon={LayoutGrid}
        />
        <DataCard
          label="Latest Design"
          value={latestRoomDesign?.roomName || "No activity"}
          Icon={TrendingUp}
          className="sm:col-span-2 lg:col-span-1"
          link={`/user-dashboard/room/${latestRoomDesign?.id}`}
        />
      </div>
    </div>
  );
}
