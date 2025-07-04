import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CandlestickController,
  CandlestickElement,
);