import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI || "";

// Create a new MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect to the MongoDB server
  await client.connect();

  // Verify connection by sending a ping command
  await client.db("admin").command({ ping: 1 });
} catch (error) {
  // Log connection errors
  console.error("Error connecting to MongoDB:", error);
}

// Select the database to use
let db = client.db("data");

export default db;
