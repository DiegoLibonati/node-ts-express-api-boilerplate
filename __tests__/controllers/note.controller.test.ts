import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import type { Request, Response } from "express";
import type { Note } from "@prisma/client";

import { NoteController } from "@/controllers/note.controller";

import { NoteService } from "@/services/note.service";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

import { mockNote } from "@tests/__mocks__/notes.mock";

jest.mock("@/services/note.service");

const buildReq = <P extends Record<string, string> = Record<string, string>>(
  overrides: Partial<Request> = {}
): Request<P> => {
  return {
    params: {},
    query: {},
    body: {},
    ...overrides,
  } as unknown as Request<P>;
};

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("note.controller", () => {
  describe("getAll", () => {
    it("should return 200 with all notes", async () => {
      (NoteService.getAllNotes as jest.Mock).mockResolvedValue([mockNote]);
      const req = buildReq();
      const res: Response = buildRes();

      await NoteController.getAll(req, res);

      expect(NoteService.getAllNotes).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getAllNotes,
        message: MESSAGES_SUCCESS.getAllNotes,
        data: { notes: [mockNote] },
      });
    });

    it("should return 200 with an empty array when there are no notes", async () => {
      (NoteService.getAllNotes as jest.Mock).mockResolvedValue([]);
      const req = buildReq();
      const res: Response = buildRes();

      await NoteController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { notes: [] } }));
    });

    it("should return 500 when service throws", async () => {
      (NoteService.getAllNotes as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq();
      const res: Response = buildRes();

      await NoteController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getById", () => {
    it("should return 200 with the note when found", async () => {
      (NoteService.getNoteById as jest.Mock).mockResolvedValue(mockNote);
      const req = buildReq<{ id: string }>({ params: { id: "1" } });
      const res: Response = buildRes();

      await NoteController.getById(req, res);

      expect(NoteService.getNoteById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getNote,
        message: MESSAGES_SUCCESS.getNote,
        data: { note: mockNote },
      });
    });

    it("should return 400 when id is not a valid positive integer", async () => {
      const req = buildReq<{ id: string }>({ params: { id: "abc" } });
      const res: Response = buildRes();

      await NoteController.getById(req, res);

      expect(NoteService.getNoteById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validId,
        message: MESSAGES_NOT.validId,
        data: null,
      });
    });

    it("should return 400 when id is zero", async () => {
      const req = buildReq<{ id: string }>({ params: { id: "0" } });
      const res: Response = buildRes();

      await NoteController.getById(req, res);

      expect(NoteService.getNoteById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when note is not found", async () => {
      (NoteService.getNoteById as jest.Mock).mockResolvedValue(null);
      const req = buildReq<{ id: string }>({ params: { id: "999" } });
      const res: Response = buildRes();

      await NoteController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
        data: null,
      });
    });

    it("should return 500 when service throws a generic error", async () => {
      (NoteService.getNoteById as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq<{ id: string }>({ params: { id: "1" } });
      const res: Response = buildRes();

      await NoteController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("create", () => {
    it("should return 201 with the created note and trim title and content", async () => {
      (NoteService.createNote as jest.Mock).mockResolvedValue(mockNote);
      const req = buildReq({
        body: { title: "  Test note  ", content: "  Test content  " },
      });
      const res: Response = buildRes();

      await NoteController.create(req, res);

      expect(NoteService.createNote).toHaveBeenCalledWith({
        title: "Test note",
        content: "Test content",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.createNote,
        message: MESSAGES_SUCCESS.createNote,
        data: { note: mockNote },
      });
    });

    it("should return 400 when title is missing", async () => {
      const req = buildReq({ body: { content: "Test content" } });
      const res: Response = buildRes();

      await NoteController.create(req, res);

      expect(NoteService.createNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validTitle,
        message: MESSAGES_NOT.validTitle,
        data: null,
      });
    });

    it("should return 400 when title is blank whitespace", async () => {
      const req = buildReq({ body: { title: "   ", content: "Test content" } });
      const res: Response = buildRes();

      await NoteController.create(req, res);

      expect(NoteService.createNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 when content is missing", async () => {
      const req = buildReq({ body: { title: "Test note" } });
      const res: Response = buildRes();

      await NoteController.create(req, res);

      expect(NoteService.createNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validContent,
        message: MESSAGES_NOT.validContent,
        data: null,
      });
    });

    it("should return 500 when service throws", async () => {
      (NoteService.createNote as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq({ body: { title: "Test", content: "Content" } });
      const res: Response = buildRes();

      await NoteController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("update", () => {
    it("should return 200 with the updated note and trim fields", async () => {
      const updatedNote: Note = { ...mockNote, title: "Updated title" };
      (NoteService.updateNote as jest.Mock).mockResolvedValue(updatedNote);
      const req = buildReq<{ id: string }>({
        params: { id: "1" },
        body: { title: "  Updated title  " },
      });
      const res: Response = buildRes();

      await NoteController.update(req, res);

      expect(NoteService.updateNote).toHaveBeenCalledWith(1, { title: "Updated title" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.updateNote,
        message: MESSAGES_SUCCESS.updateNote,
        data: { note: updatedNote },
      });
    });

    it("should not include undefined fields in the update payload", async () => {
      (NoteService.updateNote as jest.Mock).mockResolvedValue(mockNote);
      const req = buildReq<{ id: string }>({
        params: { id: "1" },
        body: { title: "New title" },
      });
      const res: Response = buildRes();

      await NoteController.update(req, res);

      expect(NoteService.updateNote).toHaveBeenCalledWith(1, { title: "New title" });
    });

    it("should return 400 when id is not a valid positive integer", async () => {
      const req = buildReq<{ id: string }>({ params: { id: "abc" }, body: { title: "Updated" } });
      const res: Response = buildRes();

      await NoteController.update(req, res);

      expect(NoteService.updateNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when note is not found", async () => {
      const notFoundError: PrismaClientKnownRequestError = new PrismaClientKnownRequestError(
        "Record not found",
        { code: "P2025", clientVersion: "5.0.0" }
      );
      (NoteService.updateNote as jest.Mock).mockRejectedValue(notFoundError);
      const req = buildReq<{ id: string }>({ params: { id: "999" }, body: { title: "Updated" } });
      const res: Response = buildRes();

      await NoteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 when service throws a generic error", async () => {
      (NoteService.updateNote as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq<{ id: string }>({ params: { id: "1" }, body: { title: "Updated" } });
      const res: Response = buildRes();

      await NoteController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("delete", () => {
    it("should return 200 with null data when note is deleted", async () => {
      (NoteService.deleteNote as jest.Mock).mockResolvedValue(mockNote);
      const req = buildReq<{ id: string }>({ params: { id: "1" } });
      const res: Response = buildRes();

      await NoteController.delete(req, res);

      expect(NoteService.deleteNote).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.deleteNote,
        message: MESSAGES_SUCCESS.deleteNote,
        data: null,
      });
    });

    it("should return 400 when id is not a valid positive integer", async () => {
      const req = buildReq<{ id: string }>({ params: { id: "0" } });
      const res: Response = buildRes();

      await NoteController.delete(req, res);

      expect(NoteService.deleteNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when note is not found", async () => {
      const notFoundError: PrismaClientKnownRequestError = new PrismaClientKnownRequestError(
        "Record not found",
        { code: "P2025", clientVersion: "5.0.0" }
      );
      (NoteService.deleteNote as jest.Mock).mockRejectedValue(notFoundError);
      const req = buildReq<{ id: string }>({ params: { id: "999" } });
      const res: Response = buildRes();

      await NoteController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 when service throws a generic error", async () => {
      (NoteService.deleteNote as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq<{ id: string }>({ params: { id: "1" } });
      const res: Response = buildRes();

      await NoteController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
