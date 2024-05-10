const Feedback = require("../models/feedbackModel");
const { generateMongoLikeId } = require("../util/generateId");
const APIFeatures = require("../utils/apiFeatures");
exports.getAllFeedbacks = async (req, res) => {
  try {
    const features = new APIFeatures(Feedback.find(), req.query)
      .filter()
      .sort()
      .paginate();

    const feedbacks = await features.query;

    res.status(200).json({
      status: "success",
      time: req.requestTime,
      data: {
        feedbacks,
        documentCount: feedbacks.length,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        feedback,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
exports.createFeedback = async (req, res) => {
  try {
    const newFeedback = await Feedback.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        feedback: newFeedback,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err,
    });
  }
};
exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "success",
      data: {
        feedback,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const id = generateMongoLikeId();
    const feedback = await Feedback.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          comments: {
            id: id,
            ...req.body,
          },
        },
      }
    );

    res.status(201).json({
      status: "success",
      data: {
        feedback,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addReply = async (req, res) => {
  try {
    const id = generateMongoLikeId();
    const feedback = await Feedback.updateOne(
      { _id: req.params.id },
      {
        $push: {
          "comments.$[comment].replies": {
            id: id,
            content: req.body.content,
            replyingTo: req.body.replyingTo,
            user: req.body.user,
          },
        },
      },
      {
        arrayFilters: [
          { "comment.id": req.params.commentId }, // Replace with actual ID
        ],
      }
    );

    res.status(201).json({
      status: "success",
      message: "successfully replied to the comment",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.upvote = async (req, res) => {
  try {
    const userId = req.params.userId; // replace with the actual user id
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback.upvoteCount.includes(userId)) {
      const feedbackUpvote = await Feedback.updateOne(
        { _id: req.params.id },
        {
          $addToSet: { upvoteCount: userId },
          $inc: { upvotes: 1 },
        }
      );

      res.status(201).json({
        status: "success",
        data: feedbackUpvote,
      });
    } else {
      const feedbackDownvote = await Feedback.updateOne(
        { _id: req.params.id },
        {
          $pull: { upvoteCount: userId },
          $inc: { upvotes: -1 },
        }
      );

      res.status(200).json({
        status: "success",
        data: feedbackDownvote,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getProjectCount = async (req, res) => {
  try {
    const planned = await Feedback.find({ status: "planned" });
    const inProgress = await Feedback.find({
      status: "in-progress",
    });
    const live = await Feedback.find({ status: "live" });

    res.status(200).json({
      status: "success",
      data: {
        plannedProjectCount: planned.length,
        inProgressProjectCount: inProgress.length,
        liveProjectCount: live.length,
        feedbacks: {
          planned,
          inProgress,
          live,
        },
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
