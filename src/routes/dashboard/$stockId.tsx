import {
  createFileRoute,
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import {
  getStockByUserIdAndSymbol,
  getStockDetailsBySymbol,
  getIntradayDataBySymbol,
} from "../../api/stockApi";
import { useUser } from "../../hooks/customHook";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Chart from "../../utils/Chart";

export const Route = createFileRoute("/dashboard/$stockId")({
  loader: async ({ params }) => {
    try {
      const res = await getStockDetailsBySymbol(params.stockId);
      if (!res) {
        return { status: 404 };
      }
      return { status: 200, data: res as StockDetails };
    } catch (error) {
      return { status: 500, error };
    }
  },
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

function RouteComponent() {
  const { data, status } = useLoaderData({ from: "/dashboard/$stockId" });
  const { stockId } = useParams({
    from: "/dashboard/$stockId",
  });
  const { user, isLoading: isUserAuthLoading } = useUser();
  const navigate = useNavigate();
  const stockDetail = data?.data;
  useEffect(() => {
    if (!isUserAuthLoading && !user) {
      navigate({ to: "/auth/login" });
    }
  }, [user, isUserAuthLoading, navigate]);

  const {
    data: stockData,
    status: stockDataStatus,
    error: stockDataError,
  } = useQuery({
    queryKey: ["stock", stockDetail?.Symbol],
    queryFn: async () => {
      if (!user) {
        throw new Error("user not found.");
      }
      return await getStockByUserIdAndSymbol(user?.id, stockId);
    },
    enabled: !!user,
  });
  type IntradayDataPoint = {
    time: string; // e.g., "10:30", "11:00"
    price: number; // Stock price at this time
  };
  const calculateStats = (data: IntradayDataPoint[]) => {
    const prices = data.map((point) => point.price);
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      open: data[data.length - 1].price, // Oldest data point
      close: data[0].price, // Most recent data point
    };
  };
  const {
    data: intradayData,
    status: intradayDataStatus,
    error: intradayDataError,
  } = useQuery({
    queryKey: ["intraday", stockDetail?.Symbol],
    queryFn: async () => {
      if (!stockId) {
        throw new Error("Stock symbol not found.");
      }
      return await getIntradayDataBySymbol(stockId);
    },
    enabled: !!stockId,
  });

  if (stockDataStatus === "pending" || intradayDataStatus === "pending") {
    return <div className="text-white text-2xl">Loading...</div>;
  }

  if (stockDataStatus === "error" || intradayDataStatus === "error") {
    return (
      <div className="text-red-500 text-2xl">
        Error: {stockDataError?.message || intradayDataError?.message}
      </div>
    );
  }

  if (status === 404) {
    return <div className="text-red-500 text-2xl">Stock not found.</div>;
  }
  const transformedData = Object.entries(
    intradayData.data["Time Series (5min)"]
  ).map(([time, values]) => ({
    time,
    price: parseFloat((values as { [key: string]: string })["4. close"]),
  }));
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
                Stock Details for {stockDetail.Symbol}
              </h1>
              <p className="text-lg text-gray-500 mt-2">{stockDetail.Name}</p>
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
                        {stockDetail.Sector}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Industry
                      </h3>
                      <p className="text-lg text-gray-800">
                        {stockDetail.Industry}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-gray-600">
                        Description
                      </h3>
                      <p className="text-lg text-gray-800">
                        {stockDetail.Description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">
                        Market Capitalization
                      </h3>
                      <p className="text-lg text-gray-800">
                        {stockDetail.MarketCapitalization}
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
                    {intradayData ? (
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
