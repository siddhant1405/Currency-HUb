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
import GradientButton from '../components/Button';
import FlagDropdown from '../components/FlagDropdown';
import { FaExchangeAlt, FaChartLine } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function ConversionPage() {
  const [activeTab, setActiveTab] = useState('convert');

  // Conversion section states
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Trends section states
  const [frankfurterCurrencies, setFrankfurterCurrencies] = useState([]);
  const [trendFrom, setTrendFrom] = useState('USD');
  const [trendTo, setTrendTo] = useState('INR');

  // Shared states
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_EXCHANGE_API_KEY;

  // Fetch Frankfurter supported currencies once on mount
  useEffect(() => {
    fetch('https://api.frankfurter.app/currencies')
      .then(res => res.json())
      .then(data => {
        const codes = Object.keys(data);
        setFrankfurterCurrencies(codes);
        if (!codes.includes(trendFrom)) setTrendFrom(codes[0]);
        if (!codes.includes(trendTo)) setTrendTo(codes[1]);
      })
      .catch(() => setFrankfurterCurrencies(['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AUD']));
    // eslint-disable-next-line
  }, []);

  // Conversion fetch
  const fetchConversion = useCallback(async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    try {
      const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      if (data.result === 'success' && data.conversion_rates) {
        const rate = data.conversion_rates[toCurrency];
        if (rate) {
          setConvertedAmount(rate * amount);
          setError(null);
        } else {
          throw new Error(`Exchange rate not found for ${toCurrency}`);
        }
      } else {
        throw new Error(data.error || 'Invalid API response');
      }
    } catch (err) {
      setError('Failed to convert currency. Please try again.');
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, API_KEY]);

  // Historical fetch for trends
  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const url = `https://api.frankfurter.app/${startStr}..${endStr}?from=${trendFrom}&to=${trendTo}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const rates = data.rates;

      const labels = Object.keys(rates).sort();
      const values = labels.map(date => rates[date][trendTo]);

      setChartData({
        labels,
        datasets: [{
          label: `${trendFrom} to ${trendTo} Exchange Rate`,
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.4
        }]
      });
      setError(null);
    } catch (err) {
      setError('Failed to load historical data.');
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [trendFrom, trendTo]);

  // Fetch on tab change or conversion/trends change
  useEffect(() => {
    if (activeTab === 'convert') {
      fetchConversion();
    } else if (activeTab === 'trends' && frankfurterCurrencies.length > 0) {
      fetchHistoricalData();
    }
  }, [activeTab, fetchConversion, fetchHistoricalData, frankfurterCurrencies.length]);

  // Fetch chart when trend currencies change
  useEffect(() => {
    if (activeTab === 'trends' && frankfurterCurrencies.length > 0) {
      fetchHistoricalData();
    }
  }, [trendFrom, trendTo, fetchHistoricalData, activeTab, frankfurterCurrencies.length]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Header>
        <GradientButton to="/">Home</GradientButton>
        <GradientButton to="/about">About Us</GradientButton>
      </Header>
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-center gap-4 mb-8 items-center">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'convert' 
                    ? 'bg-blue-900 text-white shadow' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('convert')}
              >
                <FaExchangeAlt />
                Convert
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === 'trends' 
                    ? 'bg-blue-900 text-white shadow' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('trends')}
              >
                <FaChartLine />
                See Trends
              </button>
            </div>
            {activeTab === 'convert' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-center">Currency Converter</h2>
                <div className="flex flex-col md:flex-row gap-4 items-center">
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
                  <div className="flex-1 w-full min-w-0 max-w-[320px]">
                    <label className="block text-gray-600 mb-1">From</label>
                    <FlagDropdown value={fromCurrency} onChange={setFromCurrency} />
                  </div>
                  <div className="flex-1 w-full min-w-0 max-w-[320px]">
                    <label className="block text-gray-600 mb-1">To</label>
                    <FlagDropdown value={toCurrency} onChange={setToCurrency} />
                  </div>
                </div>
                {loading && activeTab === 'convert' ? (
                  <p className="text-center text-gray-500">Converting...</p>
                ) : error && activeTab === 'convert' ? (
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
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                  <div>
                    <label className="block text-gray-600 mb-1">From</label>
                    <select
                      value={trendFrom}
                      onChange={(e) => setTrendFrom(e.target.value)}
                      className="border rounded-lg px-4 py-2 bg-white"
                    >
                      {frankfurterCurrencies.map(code => (
                        <option key={code} value={code}>{code}</option>
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
                      {frankfurterCurrencies.map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {loading && activeTab === 'trends' ? (
                  <p className="text-center text-gray-500">Loading chart...</p>
                ) : error && activeTab === 'trends' ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : chartData ? (
                  <div className="h-96">
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' }
                        },
                        scales: {
                          y: {
                            title: { display: true, text: 'Exchange Rate' }
                          }
                        }
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
