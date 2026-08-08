const express = require("express");
const router = express.Router();

const {
  getAllStagiareController,
  getStagaireByDomainController,
  createStagiareController,
  deleteStagiareController,
} = require("../controller/stagaireController");

const middleware = require("../middleware/authMiddleware");

router.get("/", middleware, getAllStagiareController);
router.post("/add", middleware, createStagiareController);
router.get("/domaine/:domaine", middleware, getStagaireByDomainController);
router.delete("/delete/:id", middleware, deleteStagiareController);

module.exports = router;
