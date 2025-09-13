import {
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
