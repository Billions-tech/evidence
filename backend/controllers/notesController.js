// backend/controllers/notesController.js

module.exports = {
  // Create a note
  async createNote(prisma, data, userId) {
    return await prisma.note.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  // Get all notes for a user
  async getNotes(prisma, userId) {
    return await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Update a note
  async updateNote(prisma, id, data, userId) {
    return await prisma.note.updateMany({
      where: { id, userId },
      data,
    });
  },

  // Delete a note
  async deleteNote(prisma, id, userId) {
    return await prisma.note.deleteMany({
      where: { id, userId },
    });
  },
};
