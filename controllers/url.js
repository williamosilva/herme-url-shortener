const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGerenateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ message: "URL is required" });
  }

  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.status(201).json({ id: shortID });
}

module.exports = {
  handleGerenateNewShortUrl,
};
