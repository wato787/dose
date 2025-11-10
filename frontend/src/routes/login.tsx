import { createFileRoute } from "@tanstack/react-router";
import { redirectIfAuthenticated } from "@/lib/auth-guard";
import { Login } from "@/views/Login";

export const Route = createFileRoute("/login")({
  beforeLoad: redirectIfAuthenticated,
  component: Login,
});
