"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  id: number;
  title: string;
  origImage?: string | null;
  redesignedImage?: string | null;
  visibility: boolean;
  createdAt: string | Date;
  userImg?: string;
  username: string;
  userEmail: string;
}

export function RoomCard({
  id,
  title,
  origImage,
  redesignedImage,
  visibility,
  createdAt,
  userImg,
  username,
  userEmail,
}: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0">
      <Link href={`/user-dashboard/room/${id}`}>
        <CardHeader className="p-0">
          <div className="relative w-full h-48 bg-muted">
            <Image
              src={redesignedImage || origImage || "/placeholder-room.jpg"}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={visibility ? "default" : "secondary"}>
                {visibility ? "Public" : "Private"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </CardContent>

      <CardFooter className="flex items-center gap-3 p-4 border-t">
        <Avatar>
          <AvatarImage src={userImg || ""} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{username}</span>
          <span className="text-xs text-muted-foreground">{userEmail}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
