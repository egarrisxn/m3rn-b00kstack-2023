import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  defer,
} from "react-router-dom";
import { AuthWrapper } from "./components/AuthWrapper";
import { HomeLayout } from "./layouts/HomeLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { HomePage } from "./pages/Home";
import { AllBooksPage } from "./pages/AllBooks";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { ProfilePage } from "./pages/Profile";
import { BookPage } from "./pages/Book";
import { BooksPage } from "./pages/Books";
import NotFoundPage from "./pages/NotFound";
import ErrorPage from "./pages/Error";

const fetchUserData = () =>
  new Promise((resolve) => {
    const user = window.localStorage.getItem("user");
    console.log("Fetched User Data from localStorage:", user); // Log data from localStorage
    resolve(user ? JSON.parse(user) : null); // Ensure data is parsed correctly
  });
// //! for error: const fetchUserData = () => new Promise((resolve, reject) => setTimeout(() => { reject("Error"); }, 3000) );

const loader = () => {
  return defer({ userPromise: fetchUserData() });
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthWrapper />}
      loader={loader}
      errorElement={<ErrorPage />}
    >
      <Route element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="allbooks" element={<AllBooksPage />} />
      </Route>

      <Route path="/protected" element={<ProtectedLayout />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="book" element={<BookPage />} /> {/* create */}
        <Route path="book/:id" element={<BookPage />} /> {/* modify */}
        <Route path="books" element={<BooksPage />} /> {/* list */}
        <Route path="allbooks" element={<AllBooksPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);
