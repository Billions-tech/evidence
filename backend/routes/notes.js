// backend/routes/notes.js
const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");

module.exports = (prisma) => {
  // Get all notes for user
  router.get("/", async (req, res) => {
    try {
      const notes = await getNotes(prisma, req.userId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // Create a note
  router.post("/", async (req, res) => {
    try {
      const note = await createNote(prisma, req.body, req.userId);
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  // Update a note
  router.put("/:id", async (req, res) => {
    try {
      const note = await updateNote(
        prisma,
        parseInt(req.params.id),
        req.body,
        req.userId
      );
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  // Delete a note
  router.delete("/:id", async (req, res) => {
    try {
      await deleteNote(prisma, parseInt(req.params.id), req.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  return router;
};
