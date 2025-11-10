import { createFileRoute } from "@tanstack/react-router";
import { redirectIfAuthenticated } from "@/lib/auth-guard";
import { SignUp } from "@/views/SignUp";

export const Route = createFileRoute("/signup")({
  beforeLoad: redirectIfAuthenticated,
  component: SignUp,
});
