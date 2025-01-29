# Herme URL Shortener

## Project Description

Herme URL Shortener is a URL shortening application developed with Node.js, MongoDB, and Docker. The project allows you to create short and customized URLs, making it easier to share long links.

## Features

- Generation of unique short URLs
- Short URL redirection
- Visit history logging
- Containerized environment with Docker

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 1.29 or higher)
- Node.js 16+ (optional, for local development)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Docker
- Docker Compose

## Environment Setup

### Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
#API_KEY is for API security, only those who have it in the request header can use the endpoints
API_KEY='xxxxxxxxxxx'

# MongoDB connection URI
# Use your own connection URI (MongoDB Atlas, local, etc.)
MONGO_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/herme-url-shortener?retryWrites=true&w=majority

#Port
PORT='0000'
```

### Installation and Execution

#### Development

```bash
# Build containers
docker-compose build
# Start containers
docker-compose up
# Start in background mode
docker-compose up -d
```

#### Production

```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d
```

#### Stop Containers

```bash
docker-compose down
```

## Project Structure

```
herme-url-shortener/
│
├── models/
├── routes/
├── controllers/
│
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
└── README.md
```

## Important Settings

- Default port: 8001
- Database: MongoDB
- Environment: Containerized

## Application Routes

### URL Shortening Route

```javascript
router.post("/");
```

- **Description**: Creates a new shortened URL
- **Method**: POST
- **Request Body**:
  ```json
  {
    "url": "Original URL to be shortened"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": "shortId"
  }
  ```
- **Status Codes**:
  - `201`: URL shortened successfully
  - `400`: URL not provided

### Redirection Route

```javascript
app.get("/:shortId");
```

- **Description**: Redirects to original URL and logs visit
- **Method**: GET
- **Parameters**:
  - `shortId`: Short URL identifier
- **Behavior**:
  - Redirects to original URL
  - Records visit timestamp
- **Status Codes**:
  - Successful redirection
  - `404`: Short URL not found
  - `500`: Internal server error

### Analytics Route

```javascript
router.get("/analytics/:shortId");
```

- **Description**: Gets statistics for a shortened URL
- **Method**: GET
- **Parameters**:
  - `shortId`: Short URL identifier
- **Success Response**:
  ```json
  {
    "totalClicks": 10,
    "analytics": [{ "timestamp": 1623456789 }, { "timestamp": 1623456790 }]
  }
  ```
- **Status Codes**:
  - `200`: Statistics returned successfully
  - `404`: Short URL not found

## Troubleshooting

### Checking Logs

```bash
# General logs
docker-compose logs
# Specific service logs
docker-compose logs app
docker-compose logs mongo
```

### Check Containers

```bash
docker-compose ps
```

## Tests

This project includes an automated test suite using the **Jest** framework to ensure the quality and functionality of the implemented features.

### Test Configuration

1. **Run Tests**:

   ```bash
   npm test
   ```

2. **Code Coverage**:
   To generate a code coverage report:
   ```bash
   npm test -- --coverage
   ```

### Test Structure

Tests are located in the `__tests__` directory and cover the main routes and functionalities of the application, including:

- **POST /url**:
  - Verifies if a short URL is created correctly.
  - Returns error if URL is not provided.
- **GET /:shortId**:

  - Tests redirection to original URL.
  - Verifies behavior for invalid IDs.

- **GET /analytics/:shortId**:
  - Ensures click and visit statistics are returned correctly.
  - Returns error for non-existent IDs.

### Test Troubleshooting

- **In-Memory MongoDB Connection**:
  Tests use `mongodb-memory-server` to create an in-memory MongoDB database, ensuring data isolation and automatic cleanup after each test.
