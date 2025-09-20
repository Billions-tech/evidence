// backend/routes/activity.js
const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

module.exports = (prisma) => {

  router.post("/", (req, res) =>
    activityController.logActivity(prisma, req, res)
  );

  return router;
};
