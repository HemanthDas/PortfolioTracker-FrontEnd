import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNotification, useUser } from "../../hooks/customHook";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getUserByUsername } from "../../api/userApi";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  const { setUser, user } = useUser();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [user, navigate]);
  const loginUserMutation = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async () => {
      return await getUserByUsername(username);
    },
    onSuccess: (data) => {
      console.log("User logged in:", data.data);
      addNotification("success", "User logged in successfully.");
      setUser(data.data);
      addNotification("success", "Redirecting to dashboard...");
      navigate({ to: "/dashboard", replace: true });
    },
    onError: (error) => {
      addNotification("error", error.message || "Failed to login user.");
      console.error("Failed to login user:", error);
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "") {
      console.error("Username is required.");
      return;
    }
    loginUserMutation.mutate();
  };
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-screen w-full flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg min-w-[300px] h-[250px] flex flex-col">
        <h1 className="text-2xl font-bold mb-6 self-center text-gray-800">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center h-full space-y-6"
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter username"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            disabled={loginUserMutation.status === "pending"}
          >
            {loginUserMutation.status === "pending" ? "Processing..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
