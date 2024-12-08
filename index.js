const express = require("express");
const connectMongoDB = require("./connect");
const urlRouter = require("./routes/url");
const app = express();
const PORT = 8001;

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

console.log("Connecting to MongoDB with URI:", MONGO_URI);
connectMongoDB(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/url", urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
