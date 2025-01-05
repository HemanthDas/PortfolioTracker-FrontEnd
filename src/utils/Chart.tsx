import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, 
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type IntradayDataPoint = {
  time: string; // e.g., "2025-01-03T15:45:00Z"
  price: number; // Stock price at this time
};

type StockChartProps = {
  data: IntradayDataPoint[];
};

const StockChart = ({ data }: StockChartProps) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No data available for the stock chart.");
    return (
      <div className="text-center text-lg text-gray-500">
        No data available for the chart.
      </div>
    );
  }

  const chartData = {
    labels: data.map((point) => new Date(point.time)),
    datasets: [
      {
        label: "Stock Price",
        data: data.map((point) => point.price),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        pointRadius: 0,
        hoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: { color: "#333", font: { size: 14 } },
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "hour",
          displayFormats: { hour: "HH:mm" },
        },
        title: {
          display: true,
          text: "Time",
          color: "#666",
          font: { size: 14 },
        },
        grid: { display: false },
        ticks: {
          color: "#444",
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
          color: "#666",
          font: { size: 14 },
        },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
        ticks: { color: "#444" },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md h-96">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Stock Performance
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
