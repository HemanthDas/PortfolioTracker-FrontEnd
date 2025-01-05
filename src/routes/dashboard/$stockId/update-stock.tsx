import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateStock, getStockByUserIdAndSymbol } from "../../../api/stockApi";
import { useNotification, useUser } from "../../../hooks/customHook";

interface Errors {
  ticker?: string;
  quantity?: string;
  buyPrice?: string;
}

export const Route = createFileRoute("/dashboard/$stockId/update-stock")({
  component: UpdateStockComponent,
});

function UpdateStockComponent() {
  const { stockId } = useParams({ from: "/dashboard/$stockId/update-stock" });
  const [ticker, setTicker] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { user, isLoading: userLoading } = useUser();

  const {
    data: stock,
    isLoading: stockLoading,
    status: stockStatus,
    error: stockDetailsError,
  } = useQuery({
    queryKey: ["getStock", stockId],
    queryFn: () => getStockByUserIdAndSymbol(user?.id ?? 0, stockId),
    enabled: !!user && !!stockId,
  });
  useEffect(() => {
    if (stockStatus === "success") {
      setTicker(stock.data.ticker);
      setQuantity(stock.data.quantity);
      setBuyPrice(stock.data.buyPrice);
    }
  }, [stockStatus, stock]);

  useEffect(() => {
    if (stockStatus === "error") {
      addNotification(
        "error",
        stockDetailsError?.message || "Failed to fetch stock details."
      );
    }
  }, [stockStatus, stockDetailsError, addNotification]);

  useEffect(() => {
    if (!user && !userLoading) {
      addNotification("error", "Please login to update a stock.");
      navigate({ to: "/auth/login", replace: true });
    }
  }, [navigate, user, userLoading, addNotification]);

  const mutation = useMutation({
    mutationKey: ["updateStock"],
    mutationFn: async () => {
      if (typeof quantity === "number" && typeof buyPrice === "number") {
        return await updateStock(Number(stock.data.id), {
          ticker,
          quantity,
          buyPrice,
        });
      }
      throw new Error("Invalid input");
    },
    onError: (error) => {
      addNotification("error", error.message || "Failed to update stock.");
    },
    onSuccess: () => {
      addNotification("success", "Stock updated successfully.");
      navigate({ to: "/dashboard", replace: true });
    },
  });

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!ticker.trim()) newErrors.ticker = "Ticker is required.";
    if (!quantity || quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0.";
    if (!buyPrice || buyPrice <= 0)
      newErrors.buyPrice = "Buy price must be greater than 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate();
    }
  };

  if (userLoading || stockLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl flex items-center space-x-4">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen w-full flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <Link
          to="/dashboard"
          className="text-white bg-transparent border-2 border-white px-4 py-2 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-500 transition-all duration-300 ease-in-out"
        >
          Back
        </Link>
      </div>
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 m-4">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-300 pb-2">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Update Stock
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Symbol
            </label>
            <input
              type="text"
              value={ticker}
              disabled
              onChange={(e) => setTicker(e.target.value)}
              className={`mt-2 block w-full border-2 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${
                errors.ticker ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter stock symbol"
              required
            />
            {errors.ticker && (
              <p className="text-red-500 text-sm mt-1">{errors.ticker}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity === "" ? "" : quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || "")}
              className={`mt-2 block w-full border-2 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter quantity"
              required
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Buy Price
            </label>
            <input
              type="number"
              step="0.01"
              value={buyPrice === "" ? "" : buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value) || "")}
              className={`mt-2 block w-full border-2 rounded-xl px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${
                errors.buyPrice ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter buy price"
              required
            />
            {errors.buyPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.buyPrice}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}
