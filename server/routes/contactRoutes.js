const { Router } = require("express");
const contactController = require("../controllers/contactController");
const { requireAuth, adminOnly } = require("../middlewares/authMiddleware");

const router = Router();

router.post("/", contactController.createContactInquiry);

router.use(requireAuth);
router.use(adminOnly);

router.get("/", contactController.getContactMessages);
router.delete("/:id", contactController.deleteContactMessage);
router.post("/:id/reply", contactController.replyContactMessage);

module.exports = router;
