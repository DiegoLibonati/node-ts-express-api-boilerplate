import type { Note } from "@/types/models";
import type { NoteCreatePayload, NoteUpdatePayload } from "@/types/payloads";

import { NoteDAO } from "@/daos/note.dao";

export const NoteService = {
  getAllNotes: (): Note[] => {
    return NoteDAO.findMany();
  },

  getNoteById: (id: number): Note | null => {
    return NoteDAO.findById(id);
  },

  createNote: (data: NoteCreatePayload): Note => {
    return NoteDAO.create(data);
  },

  updateNote: (id: number, data: NoteUpdatePayload): Note => {
    return NoteDAO.updateById(id, data);
  },

  deleteNote: (id: number): Note => {
    return NoteDAO.deleteById(id);
  },
};
