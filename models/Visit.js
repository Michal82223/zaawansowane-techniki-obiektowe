const { create } = require("connect-mongo");
const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  visitType: {
    type: String,
    default: "Tatuaż",
    enum: ["Tatuaż", "Konsultacja", "Usunięcie tatuażu", "Inny"],
  },
  visitDate: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Visit", VisitSchema);
