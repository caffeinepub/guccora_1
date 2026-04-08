import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

// Registration is now on the Home page. Redirect any direct /signup visits.
export default function SignupPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return null;
}
