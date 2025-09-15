interface RoomDetailsProps {
  params: {
    roomId: string;
  };
}

const RoomDetails = ({ params }: RoomDetailsProps) => {
  const { roomId } = params;

  return <div>{roomId}</div>;
};

export default RoomDetails;
