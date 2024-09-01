import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import Spinner from "./Spinner";
import Alert from "./Alert";

export const AuthWrapper = () => {
  const outlet = useOutlet();

  const { userPromise } = useLoaderData();

  return (
    <Suspense fallback={<Spinner />}>
      <Await
        resolve={userPromise}
        errorElement={<Alert message="Something went wrong!" type="error" />}
      >
        {(user) => {
          console.log("User data:", user);
          return <AuthProvider userData={user}>{outlet}</AuthProvider>;
        }}
      </Await>
    </Suspense>
  );
};
