import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-xl text-gray-700 mb-2">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="text-md text-gray-500">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/">
        <button className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
          Go to Homepage
        </button>
      </Link>
    </div>
  );
}
