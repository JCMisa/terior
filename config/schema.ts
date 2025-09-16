import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("userId", { length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  image: text("image"),
  credits: integer().default(5).notNull(),
  role: varchar("role").default("user").notNull(),
  createdAt: timestamp("createdAt")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const Rooms = pgTable("rooms", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdBy: varchar({ length: 255 }).notNull(),
  roomName: varchar({ length: 255 }).notNull(),
  userPrompt: varchar("userPrompt"),
  originalImageUrl: text("originalImageUrl"),
  originalRoomDescription: text("originalRoomDescription"),
  redesignedImageUrl: text("redesignedImageUrl"),
  redesignedRoomDescription: text("redesignedRoomDescription"),
  public: boolean("public").default(false),
  createdAt: timestamp("createdAt")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
