import { RedirectToSignIn, useUser } from "@clerk/clerk-react";
import React from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

