import { Router } from "express";

import { NoteController } from "@/controllers/note.controller";

const router = Router();

router.get("/", NoteController.getAll);
router.get("/:id", NoteController.getById);
router.post("/", NoteController.create);
router.put("/:id", NoteController.update);
router.delete("/:id", NoteController.delete);

export default router;
