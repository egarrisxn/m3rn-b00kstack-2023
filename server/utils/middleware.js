import jwt from "jsonwebtoken";

// Secret key for JWT (from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "";

// Middleware to authenticate requests using JWT.
const auth = async (request, response, next) => {
  // Extract the Authorization header
  const authHeader =
    request.headers.authorization || request.headers.Authorization;

  // Extract the token from the Authorization header
  const authToken = authHeader && authHeader.split(" ")[1];

  // Check if the token is provided
  if (!authToken) {
    return response.status(401).json({
      message: "User Not Authorized",
      error:
        "Authentication required. Please include an 'Authorization' header with a valid Bearer token.",
    });
  }

  try {
    // Verify the token
    jwt.verify(authToken, JWT_SECRET, (error, decoded) => {
      if (error) {
        return response.status(403).json({
          message: "Invalid credentials",
          error: "Invalid or expired token.",
        });
      }
      // Attach the decoded user information to the request object
      request.user = decoded;
      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      error: "An unexpected error occurred while verifying the token.",
    });
  }
};

export default auth;
