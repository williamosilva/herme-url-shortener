const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const URL = require("../models/url");
const urlRouter = require("../routes/url");

let mongoServer;
let app;

beforeAll(async () => {
  // Configurar servidor de memória MongoDB para testes
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Configurar aplicação Express para testes
  app = express();
  app.use(express.json());
  app.use("/url", urlRouter);
});

afterAll(async () => {
  // Limpar conexões após os testes
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Limpar a coleção antes de cada teste
  await URL.deleteMany({});
});

describe("URL Shortener API", () => {
  describe("POST /url", () => {
    it("should create a short URL", async () => {
      const response = await request(app)
        .post("/url")
        .send({ url: "https://www.example.com" });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");

      // Verificar se o URL foi salvo no banco de dados
      const savedUrl = await URL.findOne({ shortId: response.body.id });
      expect(savedUrl).toBeTruthy();
      expect(savedUrl.redirectURL).toBe("https://www.example.com");
    });

    it("should return 400 if no URL is provided", async () => {
      const response = await request(app).post("/url").send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("URL is required");
    });
  });
});
