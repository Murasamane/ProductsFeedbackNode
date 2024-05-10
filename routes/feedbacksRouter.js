const express = require("express");

const feedbacksController = require("../controllers/feedbacksController");

const {
  getAllFeedbacks,
  createFeedback,
  getFeedback,
  deleteFeedback,
  updateFeedback,
  addComment,
  addReply,
  upvote,
  getProjectCount,
} = feedbacksController;

const router = express.Router();

router.route("/").get(getAllFeedbacks).post(createFeedback);
router.route("/projects").get(getProjectCount);
router
  .route("/:id")
  .get(getFeedback)
  .delete(deleteFeedback)
  .patch(updateFeedback);
router.route("/:id/:userId/upvote").patch(upvote);
router.route("/:id/addComments/").post(addComment);
router.route("/:id/:commentId/").post(addReply);

module.exports = router;
