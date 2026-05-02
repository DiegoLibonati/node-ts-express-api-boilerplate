import type { Note } from "@prisma/client";

export const mockNote: Note = {
  id: 1,
  title: "Test note",
  content: "Test content",
  createdAt: new Date("2024-01-01T00:00:00Z"),
  updatedAt: new Date("2024-01-01T00:00:00Z"),
};
