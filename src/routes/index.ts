import { Router } from "express";

import noteRoutes from "@/routes/v1/note.route";

const router = Router();

router.use("/notes", noteRoutes);

export default router;
