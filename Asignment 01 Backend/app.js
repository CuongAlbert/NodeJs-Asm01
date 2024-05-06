const express = require("express");

const cors = require("cors");

const movieRoutes = require("./routes/movie");
const authenticateToken = require("./middleware/authenticateToken");

const app = express();

app.use(express.json());
app.use(cors);

app.use("/api/movies", authenticateToken, movieRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(8080, () => {
  console.log("Server is running");
});
