import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mx-auto items-center pt-40">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="font-semibold">Page Not Found</p>
      <button
        onClick={() => navigate("/")}
        className="inline-flex mt-2 items-center px-10 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Home Button"
      >
        Home
      </button>
    </div>
  );
}
