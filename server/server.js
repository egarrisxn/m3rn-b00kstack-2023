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
  "https://m3rn-b00k-stack.onrender.com",
  "http://localhost:5173",
];

// Middleware setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, like mobile apps or curl requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

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
