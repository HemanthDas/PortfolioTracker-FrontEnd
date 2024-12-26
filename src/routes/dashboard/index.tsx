import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/customHook";
import { useQuery } from "@tanstack/react-query";
import { getStocksByUser } from "../../api/stockApi";
import { User } from "../../context/UserContext";
import { getPortfolioValue } from "../../api/portfolioApi";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

type StockType = {
  id: number;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  user: User;
};
function RouteComponent() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/auth/login", replace: true });
    }
  }, [user, navigate, isLoading]);

  // Fetch portfolio value
  const {
    data: portfolioValue,
    isLoading: portfolioValueLoading,
    isError: isPortfolioValueError,
    error: portfolioValueError,
  } = useQuery({
    queryKey: ["portfolioValue", user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not found.");
      }
      return await getPortfolioValue(user.id);
    },
    enabled: !!user && !isLoading, // Fetch only when the user is loaded and authenticated
  });

  // Fetch stocks
  const {
    data: stocks,
    isLoading: stocksLoading,
    isError: isStocksError,
    error: stocksError,
  } = useQuery({
    queryKey: ["stocks", user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not found.");
      }
      return await getStocksByUser(user.id);
    },
    enabled: !!user && !isLoading, // Fetch only when the user is loaded and authenticated
  });

  // Handle loading states
  if (isLoading || portfolioValueLoading || stocksLoading) {
    return <div>Loading data...</div>;
  }

  // Handle error states
  if (isPortfolioValueError || isStocksError) {
    return (
      <div>
        {isPortfolioValueError && (
          <p>
            Error fetching portfolio value:{" "}
            {portfolioValueError instanceof Error
              ? portfolioValueError.message
              : "Unknown error"}
          </p>
        )}
        {isStocksError && (
          <p>
            Error fetching stocks:{" "}
            {stocksError instanceof Error
              ? stocksError.message
              : "Unknown error"}
          </p>
        )}
      </div>
    );
  }

  // Render stocks and portfolio value
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen w-full flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 m-4">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
          Dashboard
        </h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700">
            Portfolio Value
          </h2>
          <p
            className={`text-2xl font-bold ${
              portfolioValue ? "text-green-600" : "text-red-600"
            }`}
          >
            {portfolioValue
              ? `Total Value: $${portfolioValue.data}`
              : "Portfolio value not available."}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            User Stocks
          </h2>
          {stocks?.data?.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stocks?.data.map((stock: StockType, index: number) => (
                <li
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <p className="text-lg font-bold text-gray-800">
                    {stock.name} ({stock.ticker})
                  </p>
                  <p className="text-gray-600">Quantity: {stock.quantity}</p>
                  <p className="text-gray-600">Buy Price: ${stock.buyPrice}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-red-600">No stocks available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
