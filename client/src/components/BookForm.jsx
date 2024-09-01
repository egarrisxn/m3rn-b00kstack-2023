import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

const apiUrl = import.meta.env.VITE_API_URL;

export function BookForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isNew = !id;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const book = await response.json();
        if (!book) {
          console.warn(`Book with id ${id} not found`);
          navigate("/protected/books");
          return;
        }

        // Set form values with fetched data
        Object.keys(book).forEach((key) => setValue(key, book[key]));
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchData();
  }, [id, navigate, setValue, user?.token]);

  const onSubmit = async (formData) => {
    const method = isNew ? "POST" : "PATCH";
    const endpoint = isNew ? `${apiUrl}/books/create` : `${apiUrl}/books/${id}`;
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      // Reset form and navigate back
      reset();
      navigate("/protected/books");
    } catch (error) {
      console.error("Error adding or updating book:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Book Info</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {["title", "author", "year", "genre"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "year" ? "number" : "text"}
                id={field}
                {...register(field, {
                  required: `${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  } is required`,
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors[field] && (
                <span className="text-red-600">{errors[field].message}</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows="4"
          ></textarea>
          {errors.description && (
            <span className="text-red-600">{errors.description.message}</span>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Book
          </button>
        </div>
      </form>
    </div>
  );
}
