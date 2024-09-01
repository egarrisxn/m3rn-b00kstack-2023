import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import auth from "../utils/middleware.js";

const router = express.Router();
const bookCollection = db.collection("books");

//! Public Routes

// GET all books (/books/all) - Public access
router.get("/all", async (request, response) => {
  try {
    // Fetch all books from the collection
    const results = await bookCollection.find({}).toArray();
    response.status(200).send(results);
  } catch (error) {
    response.status(500).send("Error fetching books");
  }
});

//! Private Routes

// CREATE a new book (/books/create) - Authenticated users only
router.post("/create", auth, async (request, response) => {
  try {
    const userId = request.user.email; // Authenticated user's email (acts as userId)

    // Create a new book document
    const newDocument = {
      title: request.body.title,
      author: request.body.author,
      year: request.body.year,
      genre: request.body.genre,
      description: request.body.description,
      userId, // Associate book with user
    };

    // Insert the new book into the collection
    const result = await bookCollection.insertOne(newDocument);
    response.status(201).send(result);
  } catch (error) {
    response.status(500).send("Error adding book");
  }
});

// GET books for the authenticated user (/books/mine) - Authenticated users only
router.get("/mine", auth, async (request, response) => {
  try {
    const userId = request.user.email; // Authenticated user's email (acts as userId)

    // Fetch books associated with the authenticated user
    const results = await bookCollection.find({ userId }).toArray();
    response.status(200).send(results);
  } catch (error) {
    response.status(500).send("Error fetching books");
  }
});

// GET a single book (/books/:id) - Authenticated users only
router.get("/:id", auth, async (request, response) => {
  try {
    const userId = request.user.email; // Authenticated user's email (acts as userId)

    // Find a specific book by ID and ensure it belongs to the authenticated user
    const result = await bookCollection.findOne({
      _id: new ObjectId(request.params.id),
      userId,
    });

    if (!result) return response.status(404).send("Book not found");

    response.status(200).send(result);
  } catch (error) {
    response.status(500).send("Error fetching book");
  }
});

// UPDATE a book (/books/:id) - Authenticated users only
router.patch("/:id", auth, async (request, response) => {
  try {
    const userId = request.user.email; // Authenticated user's email (acts as userId)
    const query = { _id: new ObjectId(request.params.id), userId }; // Query to find the book by ID and user ID

    // Define updates to apply to the book
    const updates = {
      $set: {
        title: request.body.title,
        author: request.body.author,
        year: request.body.year,
        genre: request.body.genre,
        description: request.body.description,
      },
    };

    // Update the book in the collection
    const result = await bookCollection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      return response
        .status(404)
        .send("Book not found or you do not have permission to edit it.");
    }

    response.status(200).send(result);
  } catch (error) {
    response.status(500).send("Error updating book");
  }
});

// DELETE a book (/books/:id) - Authenticated users only
router.delete("/:id", auth, async (request, response) => {
  try {
    const userId = request.user.email; // Authenticated user's email (acts as userId)
    const query = { _id: new ObjectId(request.params.id), userId }; // Query to find the book by ID and user ID

    // Delete the book from the collection
    const result = await bookCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return response
        .status(404)
        .send("Book not found or you do not have permission to delete it.");
    }

    response.status(200).send(result);
  } catch (error) {
    response.status(500).send("Error deleting book");
  }
});

export default router;
