import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import books from "./routes/books.js";
import users from "./routes/users.js";

const PORT = process.env.PORT || 10000;

const app = express();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://m3rnb00kstack.onrender.com",
];

// Middleware setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, like mobile apps or curl requests
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Route handlers
app.use("/users", users);
app.use("/books", books);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Handle all other routes by serving the React frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  // Log server start ( .for development and debugging purposes. )
  console.log(`Server listening on port ${PORT}`);
});
