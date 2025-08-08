import React, { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GradientButton from "../components/Button";
import ConvertCard from "../components/ConvertCard";
import TrendsCard from "../components/TrendsCard";
import { FaExchangeAlt, FaChartLine } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function ConversionPage() {
  const [activeTab, setActiveTab] = useState("convert");

  // Conversion section states
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Trends section states
  const [frankfurterCurrencies, setFrankfurterCurrencies] = useState([]);
  const [trendFrom, setTrendFrom] = useState("USD");
  const [trendTo, setTrendTo] = useState("INR");

  // Shared states
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_EXCHANGE_API_KEY;

  // Fetch currency list
  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((res) => res.json())
      .then((data) => {
        const codes = Object.keys(data);
        setFrankfurterCurrencies(codes);
        if (!codes.includes(trendFrom)) setTrendFrom(codes[0]);
        if (!codes.includes(trendTo)) setTrendTo(codes[1]);
      })
      .catch(() =>
        setFrankfurterCurrencies(["USD", "EUR", "INR", "GBP", "JPY", "AUD"])
      );
    // trendFrom/trendTo not added here because they are being set, not read
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Conversion API
  const fetchConversion = useCallback(async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    try {
      const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      if (data.result === "success" && data.conversion_rates) {
        const rate = data.conversion_rates[toCurrency];
        if (rate) {
          setConvertedAmount(rate * amount);
          setError(null);
        } else {
          throw new Error(`Exchange rate not found for ${toCurrency}`);
        }
      } else {
        throw new Error(data.error || "Invalid API response");
      }
    } catch {
      setError("Failed to convert currency. Please try again.");
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, API_KEY]);

  // Historical trends API
  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      const url = `https://api.frankfurter.app/${startStr}..${endStr}?from=${trendFrom}&to=${trendTo}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const rates = data.rates;

      const labels = Object.keys(rates).sort();
      const values = labels.map((date) => rates[date][trendTo]);

      setChartData({
        labels,
        datasets: [
          {
            label: `${trendFrom} to ${trendTo} Exchange Rate`,
            data: values,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.4
          }
        ]
      });
      setError(null);
    } catch {
      setError("Failed to load historical data.");
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [trendFrom, trendTo]);

  // Trigger fetch when tab or relevant data changes
  useEffect(() => {
    if (activeTab === "convert") {
      fetchConversion();
    } else if (activeTab === "trends" && frankfurterCurrencies.length > 0) {
      fetchHistoricalData();
    }
  }, [
    activeTab,
    frankfurterCurrencies.length,
    fetchConversion,
    fetchHistoricalData
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Header>
        <GradientButton to="/">Home</GradientButton>
        <GradientButton to="/about">About Us</GradientButton>
      </Header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8 items-center">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "convert"
                    ? "bg-blue-900 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("convert")}
              >
                <FaExchangeAlt /> Convert
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "trends"
                    ? "bg-blue-900 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("trends")}
              >
                <FaChartLine /> See Trends
              </button>
            </div>

            {/* Render cards */}
            {activeTab === "convert" ? (
              <ConvertCard
                amount={amount}
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                convertedAmount={convertedAmount}
                loading={loading}
                error={error}
                setAmount={setAmount}
                setFromCurrency={setFromCurrency}
                setToCurrency={setToCurrency}
              />
            ) : (
              <TrendsCard
                frankfurterCurrencies={frankfurterCurrencies}
                trendFrom={trendFrom}
                trendTo={trendTo}
                setTrendFrom={setTrendFrom}
                setTrendTo={setTrendTo}
                chartData={chartData}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
