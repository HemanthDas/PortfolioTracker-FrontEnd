import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import {
  getStockByUserIdAndSymbol,
  getStockDetailsBySymbol,
  getIntradayDataBySymbol,
  deleteStock,
} from "../../../api/stockApi";
import { useUser } from "../../../hooks/customHook";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Chart from "../../../utils/Chart";
import { useNotification } from "../../../hooks/customHook";

export const Route = createFileRoute("/dashboard/$stockId/")({
  component: RouteComponent,
});

type StockDetails = {
  message: string;
  data: {
    Symbol: string;
    Name: string;
    Description: string;
    Sector: string;
    Industry: string;
    MarketCapitalization: string;
  };
};

type IntradayDataPoint = {
  time: string;
  price: number;
};

function RouteComponent() {
  const { stockId } = useParams({ from: "/dashboard/$stockId/" });
  const { user, isLoading: isUserAuthLoading } = useUser();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAuthLoading && !user) {
      navigate({ to: "/auth/login" });
    }
  }, [user, isUserAuthLoading, navigate]);

  const {
    data: stockDetail,
    isLoading: isStockDetailLoading,
    isError: isStockDetailError,
    error: stockDetailError,
  } = useQuery({
    queryKey: ["stockDetail", stockId],
    queryFn: async () => {
      const res = await getStockDetailsBySymbol(stockId);
      if (!res) {
        throw new Error("Stock not found");
      }
      if (res.success === false) {
        throw new Error(res.message);
      }
      return res as StockDetails;
    },
    enabled: !!stockId,
  });

  const {
    data: stockData,
    isLoading: isStockDataLoading,
    isError: isStockDataError,
    error: stockDataError,
  } = useQuery({
    queryKey: ["stock", stockDetail?.data.Symbol],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      return await getStockByUserIdAndSymbol(user?.id, stockId);
    },
    enabled: !!user && !!stockId,
  });

  const {
    data: intradayData,
    isLoading: isIntradayDataLoading,
    isError: isIntradayDataError,
    error: intradayDataError,
  } = useQuery({
    queryKey: ["intraday", stockDetail?.data.Symbol],
    queryFn: async () => {
      if (!stockId) {
        throw new Error("Stock symbol not provided.");
      }
      return await getIntradayDataBySymbol(stockId);
    },
    enabled: !!stockId,
  });

  const calculateStats = (data: IntradayDataPoint[]) => {
    const prices = data.map((point) => point.price);
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      open: data[data.length - 1]?.price || 0,
      close: data[0]?.price || 0,
    };
  };

  const transformedData =
    intradayData?.data["Time Series (5min)"] &&
    Object.entries(intradayData.data["Time Series (5min)"]).map(
      ([time, values]) => ({
        time,
        price: parseFloat((values as { [key: string]: string })["4. close"]),
      })
    );

  const handleUpdate = () =>
    navigate({ to: `/dashboard/${stockId}/update-stock` });
  const handleDelete = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      await deleteStock(stockData.data.id);
      addNotification("success", "Stock deleted successfully");
      navigate({ to: "/dashboard" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete stock";
      addNotification("error", errorMessage);
    }
  };

  if (
    isUserAuthLoading ||
    isStockDetailLoading ||
    isStockDataLoading ||
    isIntradayDataLoading
  ) {
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

  if (isStockDetailError || isStockDataError || isIntradayDataError) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-2xl">
          {stockDetailError?.message ||
            stockDataError?.message ||
            intradayDataError?.message ||
            "Unexpected error"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen py-8 px-4">
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/dashboard"
          className="text-white bg-transparent border-2 border-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-500 transition-all duration-300 ease-in-out shadow-lg"
        >
          Back
        </Link>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        {stockDetail ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Stock Details for {stockDetail.data.Symbol}
              </h1>
              <p className="text-lg text-gray-500 mt-2">
                {stockDetail.data.Name}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Details
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Sector
                      </h3>
                      <p className="text-lg text-gray-800">
                        {stockDetail.data.Sector}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Industry
                      </h3>
                      <p className="text-lg text-gray-800">
                        {stockDetail.data.Industry}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-gray-600">
                        Description
                      </h3>
                      <p className="text-lg text-gray-800">
                        {stockDetail.data.Description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Market Capitalization
                      </h3>
                      <p className="text-lg text-gray-800">
                        {stockDetail.data.MarketCapitalization}
                      </p>
                    </div>
                  </div>
                </div>
                {stockData && (
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">
                      User-Specific Data
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600">
                          Quantity
                        </h3>
                        <p className="text-lg text-gray-800">
                          {stockData.data.quantity}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600">
                          Bought Price
                        </h3>
                        <p className="text-lg text-gray-800">
                          {stockData.data.buyPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Stock Performance
                  </h2>
                  <div className="mt-4">
                    {transformedData ? (
                      <Chart data={transformedData} />
                    ) : (
                      <div className="h-32 bg-blue-200 rounded-md flex justify-center items-center">
                        <p className="text-center text-sm text-gray-600">
                          Stock performance chart will go here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Statistics
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        High
                      </h3>
                      <p className="text-lg text-gray-800">
                        {calculateStats(transformedData).high}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Low
                      </h3>
                      <p className="text-lg text-gray-800">
                        {calculateStats(transformedData).low}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Open
                      </h3>
                      <p className="text-lg text-gray-800">
                        {calculateStats(transformedData).open}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Close
                      </h3>
                      <p className="text-lg text-gray-800">
                        {calculateStats(transformedData).close}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-xl text-red-600">
            Stock details are unavailable for the stock symbol.
          </div>
        )}
      </div>
    </div>
  );
}
