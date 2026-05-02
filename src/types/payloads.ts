export interface NoteCreatePayload {
  title: string;
  content: string;
}

export interface NoteUpdatePayload {
  title?: string;
  content?: string;
}
