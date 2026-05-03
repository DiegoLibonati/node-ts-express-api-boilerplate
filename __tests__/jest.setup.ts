import { jest } from "@jest/globals";

import { resetNoteStore } from "@/daos/note.dao";

jest.setTimeout(10000);

beforeEach(() => {
  resetNoteStore();
});
