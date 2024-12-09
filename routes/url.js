const express = require("express");
const {
  handleGerenateNewShortUrl,
  handleGetAnalytics,
} = require("../controllers/url");
const router = express.Router();

router.post("/", handleGerenateNewShortUrl);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
