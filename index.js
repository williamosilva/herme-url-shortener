const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./connect");
const urlRouter = require("./routes/url");
const app = express();
const URL = require("./models/url");
const PORT = 8001;

require("dotenv").config();

const allowedOrigins = ["https://hur-f.vercel.app", "http://localhost:5173"];

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/hermedb";
const API_KEY = process.env.API_KEY;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Rota para redirecionamento fica antes do middleware de API key
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("Short URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Middleware de API key para todas as outras rotas
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
});

// Resto do seu código permanece o mesmo
connectMongoDB(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());

app.use("/url", urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
