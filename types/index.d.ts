declare interface UserType {
  id: number;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  credits: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

declare interface RoomType {
  id: number;
  createdBy: string;
  roomName: string;
  userPrompt?: string | null; // prompt passed by user to describe the expected redesigned room
  originalImageUrl?: string | null; // url image of the room uploaded by user
  originalRoomDescription?: string | null; // description of the not-designed room uploaded by user
  redesignedImageUrl?: string | null; // url image of the redesigned room provided by ai hf model
  redesignedRoomDescription?: string | null; // description of th redesigned room provided by gemini ai
  createdAt: Date;
  updatedAt: Date;
}
