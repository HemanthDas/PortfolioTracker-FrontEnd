import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/customHook";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  useEffect(() => {
      if (!isLoading && !user) {
      navigate({ to: "/auth/login", replace: true });
    }
  }, [user, navigate, isLoading]);
  return <div>Hello "/dashboard/"!</div>;
}
