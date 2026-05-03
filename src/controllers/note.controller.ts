import type { Request, Response } from "express";
import type { NoteUpdatePayload } from "@/types/payloads";

import { NoteService } from "@/services/note.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { isInteger } from "@/helpers/is_integer.helper";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

export const NoteController = {
  getAll: (_req: Request, res: Response): void => {
    try {
      const notes = NoteService.getAllNotes();
      res.status(200).json({
        code: CODES_SUCCESS.getAllNotes,
        message: MESSAGES_SUCCESS.getAllNotes,
        data: { notes },
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },

  getById: (req: Request<{ id: string }>, res: Response): void => {
    try {
      const { id } = req.params;

      if (!isInteger(id)) {
        res
          .status(400)
          .json({ code: CODES_NOT.validId, message: MESSAGES_NOT.validId, data: null });
        return;
      }

      const note = NoteService.getNoteById(Number(id));

      if (!note) {
        res
          .status(404)
          .json({ code: CODES_NOT.foundNote, message: MESSAGES_NOT.foundNote, data: null });
        return;
      }

      res.status(200).json({
        code: CODES_SUCCESS.getNote,
        message: MESSAGES_SUCCESS.getNote,
        data: { note },
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },

  create: (req: Request, res: Response): void => {
    try {
      const { title, content } = req.body as { title?: string; content?: string };

      if (!title?.trim()) {
        res
          .status(400)
          .json({ code: CODES_NOT.validTitle, message: MESSAGES_NOT.validTitle, data: null });
        return;
      }

      if (!content?.trim()) {
        res
          .status(400)
          .json({ code: CODES_NOT.validContent, message: MESSAGES_NOT.validContent, data: null });
        return;
      }

      const note = NoteService.createNote({ title: title.trim(), content: content.trim() });

      res.status(201).json({
        code: CODES_SUCCESS.createNote,
        message: MESSAGES_SUCCESS.createNote,
        data: { note },
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },

  update: (req: Request<{ id: string }>, res: Response): void => {
    try {
      const { id } = req.params;
      const { title, content } = req.body as { title?: string; content?: string };

      if (!isInteger(id)) {
        res
          .status(400)
          .json({ code: CODES_NOT.validId, message: MESSAGES_NOT.validId, data: null });
        return;
      }

      const data: NoteUpdatePayload = {};
      if (title !== undefined) data.title = title.trim();
      if (content !== undefined) data.content = content.trim();

      const note = NoteService.updateNote(Number(id), data);

      res.status(200).json({
        code: CODES_SUCCESS.updateNote,
        message: MESSAGES_SUCCESS.updateNote,
        data: { note },
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },

  delete: (req: Request<{ id: string }>, res: Response): void => {
    try {
      const { id } = req.params;

      if (!isInteger(id)) {
        res
          .status(400)
          .json({ code: CODES_NOT.validId, message: MESSAGES_NOT.validId, data: null });
        return;
      }

      NoteService.deleteNote(Number(id));

      res.status(200).json({
        code: CODES_SUCCESS.deleteNote,
        message: MESSAGES_SUCCESS.deleteNote,
        data: null,
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
};
