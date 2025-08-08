import React from "react";
import { Line } from "react-chartjs-2";

export default function TrendsCard({
  frankfurterCurrencies,
  trendFrom,
  trendTo,
  setTrendFrom,
  setTrendTo,
  chartData,
  loading,
  error
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center">
        30-Day Exchange Rate Trend
      </h2>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <div>
          <label className="block text-gray-600 mb-1">From</label>
          <select
            value={trendFrom}
            onChange={(e) => setTrendFrom(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            {frankfurterCurrencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">To</label>
          <select
            value={trendTo}
            onChange={(e) => setTrendTo(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            {frankfurterCurrencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading chart...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : chartData ? (
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "top" } },
              scales: { y: { title: { display: true, text: "Exchange Rate" } } }
            }}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
}
