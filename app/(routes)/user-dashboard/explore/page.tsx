import Pagination from "@/components/custom/Pagination";
import { getAllRooms } from "@/lib/actions/rooms";
import { EmptyState } from "@/components/custom/EmptyState";
import { RoomCard } from "../room/[roomId]/_components/RoomCard";
import { SearchBar } from "@/components/custom/SearchBar";

const ExplorePage = async ({ searchParams }: SearchParams) => {
  const query = searchParams?.query ?? "";
  const page = Number(searchParams?.page) || 1;

  const data = await getAllRooms(query, page);

  const rooms = data?.rooms ?? [];
  const pagination = data?.pagination ?? null;

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen pt-12.5 pb-20 gap-9 my-2">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Explore Rooms</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse through public room redesigns or discover your own creations.
          Use the search bar to find exactly what you&apos;re looking for.
        </p>
      </div>

      <SearchBar defaultValue={query} />

      {rooms.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map(({ room, user }) => (
            <RoomCard
              key={room?.id ?? Math.random()}
              id={room?.id ?? 0}
              title={room?.roomName ?? "Untitled Room"}
              origImage={room?.originalImageUrl}
              redesignedImage={room?.redesignedImageUrl}
              visibility={room?.public ?? false}
              createdAt={room?.createdAt ?? new Date().toISOString()}
              userImg={user?.image ?? ""}
              username={user?.name ?? "Guest"}
              userEmail={user?.email ?? ""}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No room found."
          description="Try redesigning a new room."
          actionLabel="Create Room"
          actionHref="/user-dashboard"
        />
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          queryString={query}
        />
      )}
    </main>
  );
};

export default ExplorePage;
