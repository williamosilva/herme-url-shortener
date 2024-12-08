const express = require("express");

const urlRouter = require("./routes/url");
const app = express();
const PORT = 8001;

app.use("/url", urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
