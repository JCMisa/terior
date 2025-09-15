CREATE TABLE "rooms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rooms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"createdBy" varchar(255) NOT NULL,
	"roomName" varchar(255) NOT NULL,
	"userPrompt" varchar,
	"originalImageUrl" text,
	"originalRoomDescription" text,
	"redesignedImageUrl" text,
	"redesignedRoomDescription" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
