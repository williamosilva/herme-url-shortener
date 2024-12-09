# Etapa de build
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa de produção
FROM node:16-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8001
CMD ["node", "index.js"]