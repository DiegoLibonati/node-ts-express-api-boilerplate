import type { Note } from "@/types/models";
import type { NoteCreatePayload, NoteUpdatePayload } from "@/types/payloads";

import { NotFoundError } from "@/helpers/not_found_error.helper";

let notes: Note[] = [];
let nextId = 1;

export const resetNoteStore = (): void => {
  notes = [];
  nextId = 1;
};

export const NoteDAO = {
  findMany: (): Note[] => [...notes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),

  findById: (id: number): Note | null => notes.find((n) => n.id === id) ?? null,

  create: (data: NoteCreatePayload): Note => {
    const now = new Date();
    const note: Note = { id: nextId++, ...data, createdAt: now, updatedAt: now };
    notes.push(note);
    return note;
  },

  updateById: (id: number, data: NoteUpdatePayload): Note => {
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) throw new NotFoundError();
    notes[index] = { ...notes[index]!, ...data, updatedAt: new Date() };
    return notes[index];
  },

  deleteById: (id: number): Note => {
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) throw new NotFoundError();
    const [deleted] = notes.splice(index, 1);
    return deleted!;
  },
};
