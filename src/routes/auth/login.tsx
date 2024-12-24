import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUser } from "../../hooks/customHook";
import { useState } from "react";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  // const { setUser } = useUser();
  // const [username, setUsername] = useState("");
  // const navigate = useNavigate();
  return <div className="bg-black h-screen w-full">Hello "/auth/loginn"!</div>;
}
