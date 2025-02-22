const DailyChallenge = require("../models/dailyChallengeModel");
const path = require("path");
const moment = require("moment-timezone");

const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://server-geography-genius-production.up.railway.app"
    : "http://localhost:3000";

// handles serving the daily challenge image
async function getDailyChallenge(req, res) {
  const todayStart = moment.tz("America/New_York").startOf("day").toDate();
  const todayEnd = moment.tz("America/New_York").endOf("day").toDate();

  try {
    const challenge = await DailyChallenge.findOne({
      challengeDate: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    }).populate("dailyCountries");

    if (!challenge) {
      return res.status(404).json({ message: "No daily challenge found" });
    } else {
      // Map through the dailyCountries array to construct image URLs for each country
      const imageUrls = challenge.dailyCountries.map((country) => {
        // Construct the server-side file path
        let imagePath = path.join(__dirname, "../", country.outlineImageUrl);

        // Convert the server-side file path to a URL
        let relativePath = path.relative(
          path.join(__dirname, "../assets"),
          imagePath
        );
        let imageUrl = `${SERVER_URL}/assets/${relativePath}`.replace(
          /\\/g,
          "/"
        );

        return imageUrl;
      });

      // send the image URLs to the client
      return res.json({ imageUrls });
    }
  } catch (err) {
    console.error("Error fetching daily challenge:", err);
    res.status(500).json({ message: "Error getting daily challenge" });
  }
}

// handles sending the challenge ID for the current day
async function getChallengeId(req, res) {
  const todayStart = moment.tz("America/New_York").startOf("day").toDate();
  const todayEnd = moment.tz("America/New_York").endOf("day").toDate();

  try {
    const challenge = await DailyChallenge.findOne(
      {
        challengeDate: {
          $gte: todayStart,
          $lt: todayEnd,
        },
      },
      "_id"
    );

    if (!challenge) {
      return res.status(404).json({ message: "No daily challenge found" });
    } else {
      return res.json({ challengeId: challenge._id });
    }
  } catch (err) {
    console.error("Error fetching challenge ID:", err);
    res.status(500).json({ message: "Error getting challenge ID" });
  }
}

module.exports = { getDailyChallenge, getChallengeId };
