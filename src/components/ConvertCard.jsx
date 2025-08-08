import React from "react";
import FlagDropdown from "./FlagDropdown";

export default function ConvertCard({
  amount,
  fromCurrency,
  toCurrency,
  convertedAmount,
  loading,
  error,
  setAmount,
  setFromCurrency,
  setToCurrency
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center">Currency Converter</h2>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Amount */}
        <div className="flex-1 w-full min-w-0 max-w-[220px]">
          <label className="block text-gray-600 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2 text-lg font-semibold"
            min="0"
          />
        </div>

        {/* From Currency */}
        <div className="flex-1 w-full min-w-0 max-w-[320px]">
          <label className="block text-gray-600 mb-1">From</label>
          <FlagDropdown value={fromCurrency} onChange={setFromCurrency} />
        </div>

        {/* To Currency */}
        <div className="flex-1 w-full min-w-0 max-w-[320px]">
          <label className="block text-gray-600 mb-1">To</label>
          <FlagDropdown value={toCurrency} onChange={setToCurrency} />
        </div>
      </div>

      {/* Result */}
      {loading ? (
        <p className="text-center text-gray-500">Converting...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        convertedAmount !== null && (
          <div className="text-center text-lg font-semibold">
            {amount} {fromCurrency} ={" "}
            <span className="text-blue-600">
              {convertedAmount.toFixed(2)} {toCurrency}
            </span>
          </div>
        )
      )}
    </div>
  );
}
