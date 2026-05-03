import type { Request, Response } from "express";
import type { Note } from "@/types/models";

import { NoteController } from "@/controllers/note.controller";

import { NoteService } from "@/services/note.service";

import { NotFoundError } from "@/helpers/not_found_error.helper";

import { CODES_ERROR, CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

import { mockNote } from "@tests/__mocks__/notes.mock";

jest.mock("@/services/note.service", () => ({
  NoteService: {
    getAllNotes: jest.fn(),
    getNoteById: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
  },
}));

const buildReq = (body: unknown = {}): Request => ({ params: {}, body }) as unknown as Request;

const buildReqWithId = (id: string, body: unknown = {}): Request<{ id: string }> =>
  ({ params: { id }, body }) as unknown as Request<{ id: string }>;

const buildRes = (): Response => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return mockRes as unknown as Response;
};

describe("note.controller", () => {
  let res: Response;

  beforeEach((): void => {
    res = buildRes();
  });

  describe("getAll", () => {
    it("should return 200 with all notes", () => {
      const mockNotes: Note[] = [mockNote];
      (NoteService.getAllNotes as jest.Mock).mockReturnValue(mockNotes);

      NoteController.getAll(buildReq(), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getAllNotes,
        message: MESSAGES_SUCCESS.getAllNotes,
        data: { notes: mockNotes },
      });
    });

    it("should return 500 when service throws an unexpected error", () => {
      (NoteService.getAllNotes as jest.Mock).mockImplementation(() => {
        throw new Error("unexpected");
      });

      NoteController.getAll(buildReq(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });
  });

  describe("getById", () => {
    it("should return 400 when id is not a valid integer", () => {
      NoteController.getById(buildReqWithId("abc"), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validId,
        message: MESSAGES_NOT.validId,
        data: null,
      });
    });

    it("should return 400 when id is zero", () => {
      NoteController.getById(buildReqWithId("0"), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validId,
        message: MESSAGES_NOT.validId,
        data: null,
      });
    });

    it("should return 404 when note is not found", () => {
      (NoteService.getNoteById as jest.Mock).mockReturnValue(null);

      NoteController.getById(buildReqWithId("1"), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
        data: null,
      });
    });

    it("should return 200 with note when it exists", () => {
      (NoteService.getNoteById as jest.Mock).mockReturnValue(mockNote);

      NoteController.getById(buildReqWithId("1"), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getNote,
        message: MESSAGES_SUCCESS.getNote,
        data: { note: mockNote },
      });
    });

    it("should return 500 when service throws an unexpected error", () => {
      (NoteService.getNoteById as jest.Mock).mockImplementation(() => {
        throw new Error("unexpected");
      });

      NoteController.getById(buildReqWithId("1"), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });
  });

  describe("create", () => {
    it("should return 400 when title is missing", () => {
      NoteController.create(buildReq({ content: "Content" }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validTitle,
        message: MESSAGES_NOT.validTitle,
        data: null,
      });
    });

    it("should return 400 when title is blank", () => {
      NoteController.create(buildReq({ title: "   ", content: "Content" }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validTitle,
        message: MESSAGES_NOT.validTitle,
        data: null,
      });
    });

    it("should return 400 when content is missing", () => {
      NoteController.create(buildReq({ title: "Title" }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validContent,
        message: MESSAGES_NOT.validContent,
        data: null,
      });
    });

    it("should return 400 when content is blank", () => {
      NoteController.create(buildReq({ title: "Title", content: "   " }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validContent,
        message: MESSAGES_NOT.validContent,
        data: null,
      });
    });

    it("should return 201 with created note", () => {
      (NoteService.createNote as jest.Mock).mockReturnValue(mockNote);

      NoteController.create(buildReq({ title: "Title", content: "Content" }), res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.createNote,
        message: MESSAGES_SUCCESS.createNote,
        data: { note: mockNote },
      });
    });

    it("should call service with trimmed title and content", () => {
      (NoteService.createNote as jest.Mock).mockReturnValue(mockNote);

      NoteController.create(buildReq({ title: "  Title  ", content: "  Content  " }), res);

      expect(NoteService.createNote).toHaveBeenCalledWith({
        title: "Title",
        content: "Content",
      });
    });

    it("should return 500 when service throws an unexpected error", () => {
      (NoteService.createNote as jest.Mock).mockImplementation(() => {
        throw new Error("unexpected");
      });

      NoteController.create(buildReq({ title: "Title", content: "Content" }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });
  });

  describe("update", () => {
    it("should return 400 when id is not a valid integer", () => {
      NoteController.update(buildReqWithId("abc", { title: "Title" }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validId,
        message: MESSAGES_NOT.validId,
        data: null,
      });
    });

    it("should return 200 with updated note", () => {
      (NoteService.updateNote as jest.Mock).mockReturnValue(mockNote);

      NoteController.update(buildReqWithId("1", { title: "Updated" }), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.updateNote,
        message: MESSAGES_SUCCESS.updateNote,
        data: { note: mockNote },
      });
    });

    it("should return 404 when service throws NotFoundError", () => {
      (NoteService.updateNote as jest.Mock).mockImplementation(() => {
        throw new NotFoundError();
      });

      NoteController.update(buildReqWithId("1", { title: "Updated" }), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
      });
    });

    it("should return 500 when service throws an unexpected error", () => {
      (NoteService.updateNote as jest.Mock).mockImplementation(() => {
        throw new Error("unexpected");
      });

      NoteController.update(buildReqWithId("1", { title: "Updated" }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });
  });

  describe("delete", () => {
    it("should return 400 when id is not a valid integer", () => {
      NoteController.delete(buildReqWithId("abc"), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validId,
        message: MESSAGES_NOT.validId,
        data: null,
      });
    });

    it("should return 200 when note is deleted successfully", () => {
      (NoteService.deleteNote as jest.Mock).mockReturnValue(mockNote);

      NoteController.delete(buildReqWithId("1"), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.deleteNote,
        message: MESSAGES_SUCCESS.deleteNote,
        data: null,
      });
    });

    it("should return 404 when service throws NotFoundError", () => {
      (NoteService.deleteNote as jest.Mock).mockImplementation(() => {
        throw new NotFoundError();
      });

      NoteController.delete(buildReqWithId("1"), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
      });
    });

    it("should return 500 when service throws an unexpected error", () => {
      (NoteService.deleteNote as jest.Mock).mockImplementation(() => {
        throw new Error("unexpected");
      });

      NoteController.delete(buildReqWithId("1"), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });
  });
});
