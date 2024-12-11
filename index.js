const express = require("express");
const connectMongoDB = require("./connect");
const urlRouter = require("./routes/url");
const app = express();
const URL = require("./models/url");
const PORT = 8001;

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
// const MONGO_URI = "mongodb://mongo:27017/hermedb";
const API_KEY = process.env.API_KEY;

app.use(express.json());

// Rota para redirecionamento
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    // Use findOne para evitar overhead desnecessário
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

// Middleware de validação da API Key
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
  next();
});

// Conexão com o MongoDB
connectMongoDB(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Rotas da API
app.use("/url", urlRouter);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
