import type { Note } from "@/types/models";
import type { NoteCreatePayload, NoteUpdatePayload } from "@/types/payloads";

import { NoteDAO } from "@/daos/note.dao";

import { NotFoundError } from "@/helpers/not_found_error.helper";

import { NoteService } from "@/services/note.service";

import { mockNote } from "@tests/__mocks__/notes.mock";

jest.mock("@/daos/note.dao", () => ({
  NoteDAO: {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  },
}));

describe("note.service", () => {
  describe("getAllNotes", () => {
    it("should call NoteDAO.findMany and return the result", () => {
      const mockNotes: Note[] = [mockNote];
      (NoteDAO.findMany as jest.Mock).mockReturnValue(mockNotes);

      const result: Note[] = NoteService.getAllNotes();

      expect(NoteDAO.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNotes);
    });

    it("should return an empty array when no notes exist", () => {
      (NoteDAO.findMany as jest.Mock).mockReturnValue([]);

      const result: Note[] = NoteService.getAllNotes();

      expect(result).toEqual([]);
    });
  });

  describe("getNoteById", () => {
    it("should call NoteDAO.findById with the correct id and return the note", () => {
      (NoteDAO.findById as jest.Mock).mockReturnValue(mockNote);

      const result: Note | null = NoteService.getNoteById(1);

      expect(NoteDAO.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNote);
    });

    it("should return null when the note does not exist", () => {
      (NoteDAO.findById as jest.Mock).mockReturnValue(null);

      const result: Note | null = NoteService.getNoteById(999);

      expect(result).toBeNull();
    });
  });

  describe("createNote", () => {
    it("should call NoteDAO.create with the payload and return the created note", () => {
      const payload: NoteCreatePayload = { title: "New note", content: "Body" };
      (NoteDAO.create as jest.Mock).mockReturnValue(mockNote);

      const result: Note = NoteService.createNote(payload);

      expect(NoteDAO.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockNote);
    });
  });

  describe("updateNote", () => {
    it("should call NoteDAO.updateById with id and data and return the updated note", () => {
      const payload: NoteUpdatePayload = { title: "Updated" };
      (NoteDAO.updateById as jest.Mock).mockReturnValue(mockNote);

      const result: Note = NoteService.updateNote(1, payload);

      expect(NoteDAO.updateById).toHaveBeenCalledWith(1, payload);
      expect(result).toEqual(mockNote);
    });

    it("should propagate NotFoundError when DAO throws", () => {
      (NoteDAO.updateById as jest.Mock).mockImplementation(() => {
        throw new NotFoundError();
      });

      expect(() => NoteService.updateNote(999, {})).toThrow(NotFoundError);
    });
  });

  describe("deleteNote", () => {
    it("should call NoteDAO.deleteById with the id and return the deleted note", () => {
      (NoteDAO.deleteById as jest.Mock).mockReturnValue(mockNote);

      const result: Note = NoteService.deleteNote(1);

      expect(NoteDAO.deleteById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNote);
    });

    it("should propagate NotFoundError when DAO throws", () => {
      (NoteDAO.deleteById as jest.Mock).mockImplementation(() => {
        throw new NotFoundError();
      });

      expect(() => NoteService.deleteNote(999)).toThrow(NotFoundError);
    });
  });
});
