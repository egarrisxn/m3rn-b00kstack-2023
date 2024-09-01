import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const apiUrl = import.meta.env.VITE_API_URL;

const BookList = ({ book, deleteBook, isPrivate }) => (
  <tr className="border-b hover:bg-gray-100 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {book.title}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {book.author}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {book.year}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {book.genre}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {book.description}
    </td>
    {!isPrivate && book.userId && (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {book.userId}
      </td>
    )}
    {isPrivate && deleteBook && (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex space-x-2">
          <Link
            to={`/protected/book/${book._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-yellow-500 text-white hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => deleteBook(book._id)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </td>
    )}
  </tr>
);
export function BookTable({ isPrivate, onDataFetch }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let url = `${apiUrl}/books/all`;
        let options = {};

        if (isPrivate) {
          if (!user || !user.token) {
            console.error("User is not authenticated");
            return;
          }
          url = `${apiUrl}/books/mine`;
          options = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
        }

        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        setBooks(data);
        if (onDataFetch) onDataFetch(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [isPrivate, user, onDataFetch]);

  const deleteBook = async (id) => {
    if (!isPrivate || !user || !user.token) return;

    try {
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {isPrivate ? "Your Books" : "All Books"}
      </h2>
      {isPrivate && (
        <div className="mb-4">
          <Link
            to="/protected/book"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Book
          </Link>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              {!isPrivate && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added By
                </th>
              )}
              {isPrivate && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <BookList
                book={book}
                deleteBook={isPrivate ? deleteBook : null}
                isPrivate={isPrivate}
                key={book._id || book.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
