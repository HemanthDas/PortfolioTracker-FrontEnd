import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createUser } from "../../api/userApi";
import { initializePortfolio } from "../../api/portfolioApi";
import { useUser } from "../../hooks/customHook";
import { useNotification } from "../../hooks/customHook";

export const Route = createFileRoute("/auth/register")({
  component: Register,
  beforeLoad: () => {
    console.log("Checking if user is already logged in...");
    if (localStorage.getItem("user")) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
});

function Register() {
  const [username, setUsername] = useState<string>("");
  const naviagte = useNavigate();
  const { setUser, user, isLoading } = useUser();
  const { addNotification } = useNotification();
  useEffect(() => {
    if (user && !isLoading) {
      naviagte({ to: "/dashboard", replace: true });
    }
  }, [user, naviagte, isLoading]);
  const createUserMutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async () => {
      return await createUser(username);
    },
    onSuccess: (data) => {
      setUser(data.user);
      addNotification(
        "success",
        "User created successfully. Initializing portfolio..."
      );
      initializePortfolioMutation.mutate();
    },
    onError: (error: Error) => {
      addNotification("error", error.message || "Failed to create user.");
    },
  });

  const initializePortfolioMutation = useMutation({
    mutationKey: ["initializePortfolio", username],
    mutationFn: async () => {
      return await initializePortfolio(username);
    },
    onSuccess: async () => {
      addNotification("success", "Portfolio initialized successfully!");
      addNotification("success", "Redirecting to dashboard...");
      setTimeout(() => {
        naviagte({ to: "/dashboard", replace: true });
      }, 1000);
    },
    onError: (error: Error) => {
      addNotification(
        "error",
        error.message || "Failed to initialize portfolio."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() === "") {
      addNotification("error", "Username is required.");
      return;
    }

    createUserMutation.mutate();
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-screen w-full flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg min-w-[300px] h-[300px] flex flex-col">
        <h1 className="text-2xl font-bold mb-6 self-center text-gray-800">
          Register
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
            disabled={
              createUserMutation.status === "pending" ||
              initializePortfolioMutation.status === "pending"
            }
          >
            {createUserMutation.status === "pending" ||
            initializePortfolioMutation.status === "pending"
              ? "Processing..."
              : "Register"}
          </button>
        </form>
        {/* <p className="mt-4 text-center text-gray-600"> */}
        <span className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-purple-600 hover:text-purple-800"
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Register;
