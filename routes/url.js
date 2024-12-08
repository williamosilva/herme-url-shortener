const express = require("express");
const { handleGerenateNewShortUrl } = require("../controllers/url");
const router = express.Router();

router.post("/", handleGerenateNewShortUrl);

module.exports = router;
