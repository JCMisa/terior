import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabOriginal from "./TabOriginal";
import TabsRedesigned from "./TabsRedesigned";

export default function TabsSection({
  room,
  canEdit,
}: {
  room: RoomType;
  canEdit: boolean;
}) {
  return (
    <Tabs defaultValue="original" className="w-full max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="original">Original</TabsTrigger>
        <TabsTrigger value="redesigned">Redesigned</TabsTrigger>
      </TabsList>

      <TabsContent value="original">
        <TabOriginal room={room} canEdit={canEdit} />
      </TabsContent>

      <TabsContent value="redesigned">
        <TabsRedesigned room={room} canEdit={canEdit} />
      </TabsContent>
    </Tabs>
  );
}
