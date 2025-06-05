// ⛳️ Importing
import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaExchangeAlt, FaChartLine } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

// ✅ Currency codes list (unchanged)
const currencyCodes = [/* your full currency array */];

export default function ConversionPage() {
  const [activeTab, setActiveTab] = useState('convert');
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🌐 Load API key and base URL from environment variables
  const API_KEY = process.env.REACT_APP_EXCHANGE_API_KEY;
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // 🔁 Conversion fetch
  const fetchConversion = useCallback(async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    try {
      const url = `${BASE_URL}/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("Conversion API Response:", data);

      if (data.result && data.conversion_result !== null) {
        setConvertedAmount(data.conversion_result);
        setError(null);
      } else if (data.conversion_rate) {
        // fallback for some response structures
        setConvertedAmount(data.conversion_rate * amount);
        setError(null);
      } else {
        throw new Error('Invalid conversion response');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to convert currency. Please try again.');
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, BASE_URL, API_KEY]);

  // 📈 Historical fetch (uses exchangerate.host as you originally had)
  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const url = `https://api.exchangerate.host/timeseries?base=${fromCurrency}&symbols=${toCurrency}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.rates) {
        const labels = Object.keys(data.rates);
        const values = labels.map(date => data.rates[date][toCurrency]);
        setChartData({
          labels,
          datasets: [{
            label: `${fromCurrency} to ${toCurrency} Exchange Rate`,
            data: values,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4
          }]
        });
        setError(null);
      } else {
        throw new Error('Invalid historical data response');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load historical data');
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  // 🔄 Trigger fetches based on tab
  useEffect(() => {
    if (activeTab === 'convert') {
      fetchConversion();
    } else {
      fetchHistoricalData();
    }
  }, [activeTab, fetchConversion, fetchHistoricalData]);

  // 🧠 JSX return block (same as before)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Header>
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'convert' ? 'bg-blue-900 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('convert')}
        >
          <FaExchangeAlt />
          Convert
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'trends' ? 'bg-blue-900 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('trends')}
        >
          <FaChartLine />
          See Trends
        </button>
      </Header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {activeTab === 'convert' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-center">Currency Converter</h2>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <label className="block text-gray-600 mb-1">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full border rounded-lg px-4 py-2 text-lg font-semibold"
                      min="0"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-gray-600 mb-1">From</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-lg font-semibold"
                    >
                      {currencyCodes.map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-gray-600 mb-1">To</label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-lg font-semibold"
                    >
                      {currencyCodes.map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {loading ? (
                  <p className="text-center text-gray-500">Converting...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : (
                  convertedAmount !== null && (
                    <div className="text-center text-lg font-semibold">
                      {amount} {fromCurrency} = <span className="text-blue-600">{convertedAmount.toFixed(2)} {toCurrency}</span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-center">30-Day Exchange Rate Trend</h2>
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
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          y: {
                            title: {
                              display: true,
                              text: 'Exchange Rate',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No data available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
