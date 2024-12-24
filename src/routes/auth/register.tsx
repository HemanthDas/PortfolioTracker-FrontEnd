import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

function Register() {
  const [username, setUsername] = useState<string>("");
  
  const handleSubmit = () => {};
  return (
    <div className="bg-black h-screen w-full flex justify-center items-center  flex-col">
      <p className="text-white mb-4">
        Enter your username and remember it for every login.
      </p>
      <div className="bg-white p-8 rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <div className="mt-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
