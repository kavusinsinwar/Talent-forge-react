/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { pathname } = useLocation();

  // Redirect to login if the user is not signed in
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  // Redirect to onboarding if the user doesn't have a role and is not already on the onboarding page
  if (user && !user?.unsafeMetadata?.role && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  return children; // Render the protected route content
};

export default ProtectedRoute;
