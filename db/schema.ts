import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const devices = sqliteTable("devices", {
  tokenHash: text("token_hash").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id),
  label: text("label"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [index("devices_profile_idx").on(table.profileId)]);

export const studyState = sqliteTable("study_state", {
  profileId: text("profile_id").primaryKey().references(() => profiles.id),
  stateJson: text("state_json").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const attempts = sqliteTable("attempts", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id),
  subject: text("subject").notNull(),
  quizId: text("quiz_id").notNull(),
  questionId: integer("question_id").notNull(),
  topic: text("topic").notNull(),
  selected: text("selected").notNull(),
  correct: integer("correct", { mode: "boolean" }).notNull(),
  isReview: integer("is_review", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
  index("attempts_profile_idx").on(table.profileId),
  index("attempts_topic_idx").on(table.profileId, table.subject, table.topic),
]);

export const parentSettings = sqliteTable("parent_settings", {
  profileId: text("profile_id").primaryKey().references(() => profiles.id),
  pinSalt: text("pin_salt").notNull(),
  pinHash: text("pin_hash").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const parentSessions = sqliteTable("parent_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [index("parent_sessions_profile_idx").on(table.profileId)]);

export const pairingCodes = sqliteTable("pairing_codes", {
  codeHash: text("code_hash").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [index("pairing_codes_profile_idx").on(table.profileId)]);
