import type { Note } from "@prisma/client";
import type { NoteCreatePayload, NoteUpdatePayload } from "@/types/payloads";

import { NoteService } from "@/services/note.service";

import { NoteDAO } from "@/daos/note.dao";

import { mockNote } from "@tests/__mocks__/notes.mock";

jest.mock("@/daos/note.dao");

describe("note.service", () => {
  describe("getAllNotes", () => {
    it("should return all notes from the DAO", async () => {
      (NoteDAO.findMany as jest.Mock).mockResolvedValue([mockNote]);

      const result: Note[] = await NoteService.getAllNotes();

      expect(NoteDAO.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockNote]);
    });

    it("should return an empty array when there are no notes", async () => {
      (NoteDAO.findMany as jest.Mock).mockResolvedValue([]);

      const result: Note[] = await NoteService.getAllNotes();

      expect(result).toEqual([]);
    });
  });

  describe("getNoteById", () => {
    it("should return the note when it exists", async () => {
      (NoteDAO.findById as jest.Mock).mockResolvedValue(mockNote);

      const result: Note | null = await NoteService.getNoteById(1);

      expect(NoteDAO.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNote);
    });

    it("should return null when the note does not exist", async () => {
      (NoteDAO.findById as jest.Mock).mockResolvedValue(null);

      const result: Note | null = await NoteService.getNoteById(999);

      expect(NoteDAO.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe("createNote", () => {
    it("should create and return the note", async () => {
      const payload: NoteCreatePayload = { title: "Test note", content: "Test content" };
      (NoteDAO.create as jest.Mock).mockResolvedValue(mockNote);

      const result: Note = await NoteService.createNote(payload);

      expect(NoteDAO.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockNote);
    });
  });

  describe("updateNote", () => {
    it("should update and return the note", async () => {
      const payload: NoteUpdatePayload = { title: "Updated title" };
      const updatedNote: Note = { ...mockNote, title: "Updated title" };
      (NoteDAO.updateById as jest.Mock).mockResolvedValue(updatedNote);

      const result: Note = await NoteService.updateNote(1, payload);

      expect(NoteDAO.updateById).toHaveBeenCalledWith(1, payload);
      expect(result).toEqual(updatedNote);
    });
  });

  describe("deleteNote", () => {
    it("should delete the note by calling the DAO with the given id", async () => {
      (NoteDAO.deleteById as jest.Mock).mockResolvedValue(mockNote);

      await NoteService.deleteNote(1);

      expect(NoteDAO.deleteById).toHaveBeenCalledWith(1);
      expect(NoteDAO.deleteById).toHaveBeenCalledTimes(1);
    });
  });
});
