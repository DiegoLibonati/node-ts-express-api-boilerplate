import request from "supertest";

import type { Response } from "supertest";
import type { Note } from "@prisma/client";

import app from "@/app";

import { prisma } from "@/configs/prisma.config";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

const baseUrl = "/api/v1/notes";

describe("note.route", () => {
  beforeEach(async (): Promise<void> => {
    await prisma.note.deleteMany();
  });

  afterAll(async (): Promise<void> => {
    await prisma.$disconnect();
  });

  describe(`GET ${baseUrl}`, () => {
    it("should return 200 with an empty array when there are no notes", async () => {
      const response: Response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.getAllNotes,
        message: MESSAGES_SUCCESS.getAllNotes,
        data: { notes: [] },
      });
    });

    it("should return 200 with all notes", async () => {
      await prisma.note.createMany({
        data: [
          { title: "First note", content: "Content A" },
          { title: "Second note", content: "Content B" },
        ],
      });

      const response: Response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.data.notes).toHaveLength(2);
    });
  });

  describe(`GET ${baseUrl}/:id`, () => {
    it("should return 200 with the note when it exists", async () => {
      const note: Note = await prisma.note.create({
        data: { title: "Test note", content: "Test content" },
      });

      const response: Response = await request(app).get(`${baseUrl}/${note.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.getNote,
        message: MESSAGES_SUCCESS.getNote,
        data: {
          note: expect.objectContaining({ id: note.id, title: "Test note" }),
        },
      });
    });

    it("should return 404 when the note does not exist", async () => {
      const response: Response = await request(app).get(`${baseUrl}/99999`);

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(CODES_NOT.foundNote);
    });

    it("should return 400 when id is not a valid positive integer", async () => {
      const response: Response = await request(app).get(`${baseUrl}/abc`);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validId);
    });

    it("should return 400 when id is zero", async () => {
      const response: Response = await request(app).get(`${baseUrl}/0`);

      expect(response.status).toBe(400);
    });
  });

  describe(`POST ${baseUrl}`, () => {
    it("should return 201 with the created note and trim title and content", async () => {
      const payload: { title: string; content: string } = {
        title: "  New note  ",
        content: "  Note content  ",
      };

      const response: Response = await request(app).post(baseUrl).send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.createNote,
        message: MESSAGES_SUCCESS.createNote,
        data: {
          note: expect.objectContaining({
            id: expect.any(Number),
            title: "New note",
            content: "Note content",
          }),
        },
      });

      const fromDb: Note | null = await prisma.note.findUnique({
        where: { id: response.body.data.note.id },
      });
      expect(fromDb).not.toBeNull();
    });

    it("should return 400 when title is missing", async () => {
      const response: Response = await request(app).post(baseUrl).send({ content: "Content" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validTitle);

      const count: number = await prisma.note.count();
      expect(count).toBe(0);
    });

    it("should return 400 when title is blank whitespace", async () => {
      const response: Response = await request(app)
        .post(baseUrl)
        .send({ title: "   ", content: "Content" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validTitle);
    });

    it("should return 400 when content is missing", async () => {
      const response: Response = await request(app).post(baseUrl).send({ title: "Title" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validContent);
    });
  });

  describe(`PUT ${baseUrl}/:id`, () => {
    it("should return 200 with the updated note", async () => {
      const note: Note = await prisma.note.create({
        data: { title: "Original title", content: "Original content" },
      });

      const response: Response = await request(app)
        .put(`${baseUrl}/${note.id}`)
        .send({ title: "  Updated title  " });

      expect(response.status).toBe(200);
      expect(response.body.data.note.title).toBe("Updated title");
      expect(response.body.data.note.content).toBe("Original content");

      const fromDb: Note | null = await prisma.note.findUnique({ where: { id: note.id } });
      expect(fromDb?.title).toBe("Updated title");
    });

    it("should return 400 when id is not a valid positive integer", async () => {
      const response: Response = await request(app)
        .put(`${baseUrl}/abc`)
        .send({ title: "Updated" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validId);
    });

    it("should return 404 when the note does not exist", async () => {
      const response: Response = await request(app)
        .put(`${baseUrl}/99999`)
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(CODES_NOT.foundNote);
    });
  });

  describe(`DELETE ${baseUrl}/:id`, () => {
    it("should return 200 and delete the note", async () => {
      const note: Note = await prisma.note.create({
        data: { title: "To delete", content: "Content" },
      });

      const response: Response = await request(app).delete(`${baseUrl}/${note.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.deleteNote,
        message: MESSAGES_SUCCESS.deleteNote,
        data: null,
      });

      const fromDb: Note | null = await prisma.note.findUnique({ where: { id: note.id } });
      expect(fromDb).toBeNull();
    });

    it("should return 400 when id is not a valid positive integer", async () => {
      const response: Response = await request(app).delete(`${baseUrl}/abc`);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validId);
    });

    it("should return 404 when the note does not exist", async () => {
      const response: Response = await request(app).delete(`${baseUrl}/99999`);

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(CODES_NOT.foundNote);
    });
  });

  describe("GET /health", () => {
    it("should return 200 with status ok", async () => {
      const response: Response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("unknown route", () => {
    it("should return 404 for an unregistered route", async () => {
      const response: Response = await request(app).get("/api/v1/unknown");

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(CODES_NOT.foundRoute);
    });
  });
});
