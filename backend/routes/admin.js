// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

module.exports = (prisma) => {

  router.get("/metrics", (req, res) =>
    adminController.getMetrics(prisma, req, res)
  );
  router.get("/activity", (req, res) =>
    adminController.getActivity(prisma, req, res)
  );

  return router;
};
