import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/add-stock")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/add-stock"!</div>;
}
