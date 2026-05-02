import { Prisma } from "@prisma/client";

import type { Note } from "@prisma/client";
import type { NoteCreatePayload, NoteUpdatePayload } from "@/types/payloads";

import { NoteDAO } from "@/daos/note.dao";

import { prisma } from "@/configs/prisma.config";

const validPayload: NoteCreatePayload = {
  title: "Test note",
  content: "Test content",
};

describe("note.dao", () => {
  beforeEach(async (): Promise<void> => {
    await prisma.note.deleteMany();
  });

  afterAll(async (): Promise<void> => {
    await prisma.$disconnect();
  });

  describe("findMany", () => {
    it("should return an empty array when there are no notes", async () => {
      const result: Note[] = await NoteDAO.findMany();

      expect(result).toEqual([]);
    });

    it("should return all notes ordered by createdAt descending", async () => {
      await prisma.note.create({
        data: { title: "First", content: "A", createdAt: new Date("2024-01-01T00:00:00Z") },
      });
      await prisma.note.create({
        data: { title: "Second", content: "B", createdAt: new Date("2024-01-02T00:00:00Z") },
      });

      const result: Note[] = await NoteDAO.findMany();

      expect(result).toHaveLength(2);
      expect(result[0]!.title).toBe("Second");
      expect(result[1]!.title).toBe("First");
    });
  });

  describe("findById", () => {
    it("should return the note when it exists", async () => {
      const created: Note = await prisma.note.create({ data: validPayload });

      const result: Note | null = await NoteDAO.findById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.title).toBe(validPayload.title);
      expect(result?.content).toBe(validPayload.content);
    });

    it("should return null when the note does not exist", async () => {
      const result: Note | null = await NoteDAO.findById(99999);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should insert a note and return it with a generated id", async () => {
      const result: Note = await NoteDAO.create(validPayload);

      expect(result.id).toEqual(expect.any(Number));
      expect(result.title).toBe(validPayload.title);
      expect(result.content).toBe(validPayload.content);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it("should persist the note to the database", async () => {
      const created: Note = await NoteDAO.create(validPayload);

      const fromDb: Note | null = await prisma.note.findUnique({
        where: { id: created.id },
      });

      expect(fromDb).not.toBeNull();
      expect(fromDb?.title).toBe(validPayload.title);
      expect(fromDb?.content).toBe(validPayload.content);
    });
  });

  describe("updateById", () => {
    it("should update the note and return the updated record", async () => {
      const created: Note = await prisma.note.create({ data: validPayload });
      const update: NoteUpdatePayload = { title: "Updated title" };

      const result: Note = await NoteDAO.updateById(created.id, update);

      expect(result.id).toBe(created.id);
      expect(result.title).toBe("Updated title");
      expect(result.content).toBe(validPayload.content);
    });

    it("should throw PrismaClientKnownRequestError P2025 when note does not exist", async () => {
      try {
        await NoteDAO.updateById(99999, { title: "x" });
        fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2025");
      }
    });
  });

  describe("deleteById", () => {
    it("should delete the note and return the deleted record", async () => {
      const created: Note = await prisma.note.create({ data: validPayload });

      const result: Note = await NoteDAO.deleteById(created.id);

      expect(result.id).toBe(created.id);

      const fromDb: Note | null = await prisma.note.findUnique({
        where: { id: created.id },
      });
      expect(fromDb).toBeNull();
    });

    it("should throw PrismaClientKnownRequestError P2025 when note does not exist", async () => {
      try {
        await NoteDAO.deleteById(99999);
        fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2025");
      }
    });
  });
});
