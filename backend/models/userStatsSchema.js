const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // A user can only have one userStats document
    },
    totalGames: {
      type: Number,
      default: 0,
    },
    totalWins: {
      type: Number,
      default: 0,
    },
    totalGuesses: {
      type: Number,
      default: 0,
    },
    averageGuesses: {
      type: Number,
      default: 0,
    },
    currentWinStreak: {
      type: Number,
      default: 0,
    },
    longestWinStreak: {
      type: Number,
      default: 0,
    },
    hintsUsed: {
      type: Number,
      default: 0,
    },
    countriesGuessed: {
      type: Map,
      of: Number, // map country to how many times it's been guessed
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStats", userStatsSchema);
