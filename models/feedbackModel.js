const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Must have a title"],
  },
  category: {
    type: String,
    required: [true, "Must have a category"],
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "suggestion",
  },
  description: {
    type: String,
    required: [true, "Must have an description"],
  },
  comments: {
    type: Array,
    default: [],
  },
  upvoteCount: {
    type: Array,
    default: [],
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
