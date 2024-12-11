const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./connect");
const urlRouter = require("./routes/url");
const app = express();
const URL = require("./models/url");
const PORT = 8001;

require("dotenv").config();

const allowedOrigins = [
  "https://herme-url.vercel.app",
  "http://localhost:5173",
];

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/hermedb";
const API_KEY = process.env.API_KEY;

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// Rota para redirecionamento fica antes do middleware de API key
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    // Use findOne em vez de findOneAndUpdate para reduzir overhead
    const entry = await URL.findOne({ shortId });

    if (entry) {
      // Atualização em background para não bloquear a resposta
      URL.updateOne(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
      ).exec(); // Executa sem await

      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("Short URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
// Middleware de API key com early return
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
  next();
});

// Resto do seu código permanece o mesmo
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
