import React, { useState, useMemo } from 'react';
import axios from 'axios';
import {
  Search, TrendingUp, TrendingDown, MessageSquare,
  Activity, AlertCircle, Loader2, MessageCircle, ArrowBigUp
} from 'lucide-react';

// CORRECT RedditIcon component
const RedditIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path d="M19.5,8.2c-0.1-0.6-0.6-1.1-1.2-1.2c-2.4-0.4-4.8-0.6-7.2-0.6H11v-1c0.1-2.1-1.5-3.9-3.6-4c-2.1-0.1-3.9,1.5-4,3.6v0.4h1.7c0.2,0,0.4,0.1,0.5,0.3c0.1,0.2,0.1,0.4-0.1,0.5L4.4,6.7C4.3,6.8,4.1,6.8,4,6.8h-2c-0.1,0-0.2,0-0.3-0.1C1.6,6.6,1.6,6.4,1.6,6.3l0.9-1.3c0.1-0.2,0.1-0.4-0.1-0.5C2.4,4.4,2.2,4.3,2,4.3h-1c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1h18c0.6,0,1-0.4,1-1V9.2C20.5,8.6,20.1,8.2,19.5,8.2z M3,18V8.9c0.7,0.4,1.4,0.7,2.2,0.8L5.7,11c-0.1,0.4,0.1,0.8,0.5,0.9c0.4,0.1,0.8-0.1,0.9-0.5l0.4-1.2h2c-0.1,0.4,0.1,0.8,0.5,0.9c0.4,0.1,0.8-0.1,0.9-0.5l0.4-1.2h2.2l-0.4,1.2c-0.1,0.4,0.1,0.8,0.5,0.9c0.4,0.1,0.8-0.1,0.9-0.5l0.4-1.2c0.8,0.1,1.5,0.4,2.2,0.8V18H3z M17.5,10.2c-0.7-0.1-1.4-0.3-2.1-0.5c-0.2-0.1-0.4-0.1-0.5,0.1c-0.1,0.2-0.1,0.4,0.1,0.5l0.4,0.1c0.7,0.2,1.4,0.4,2.1,0.5C18.2,10.9,18.4,11.1,18.4,11.3V18h-1.8V9.2c0-0.6,0.4-1,1-1H18c0.6,0,1,0.4,1,1V10.2z M10,9.2h-2c-0.1,0-0.2,0-0.3-0.1C7.6,9,7.6,8.8,7.6,8.7l0.9-1.3c0.1-0.2,0.1-0.4-0.1-0.5C8.4,6.7,8.2,6.6,8,6.6H6c-0.1,0-0.2,0-0.3-0.1C5.6,6.4,5.6,6.2,5.6,6.1l0.9-1.3c0.1-0.2,0.1-0.4-0.1-0.5C6.4,4.2,6.2,4.1,6,4.1H4.3v-1c0-0.6,0.4-1,1-1h2.7C9.6,2.1,11,3.5,11,5.2V7.2h-1c-0.6,0-1,0.4-1,1v1C9,9.6,9.4,10,10,10h2c0.6,0,1-0.4,1-1V8.2c0-0.6-0.4-1-1-1h-1V5.2c0-1.7,1.4-3.1,3.1-3.1h2.7c0.6,0,1,0.4,1,1v1h-1.7c-0.2,0-0.4,0.1-0.5,0.3c-0.1,0.2-0.1,0.4,0.1,0.5l1.3,1.9c0.1,0.1,0.3,0.1,0.4,0.1h2c0.1,0,0.2,0,0.3-0.1C18.4,6.6,18.4,6.4,18.4,6.3l-0.9-1.3c-0.1-0.2-0.1-0.4,0.1-0.5C17.6,4.4,17.8,4.3,18,4.3h1c0.6,0,1,0.4,1,1V7.2C20,7.7,19.6,8.2,19,8.2h-1c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V9.2c0-0.6,0.4-1,1-1h0.5c0,0,0,0,0,0h0v-1C20.5,7.7,20.1,7.2,19.5,7.2C19.5,7.2,19.5,7.2,19.5,7.2z M10,11.2h-2c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1v-1C11,11.6,10.6,11.2,10,11.2z M15,11.2h-2c-0.6,0-1,0.4-1,1v1c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1v-1C16,11.6,15.6,11.2,15,11.2z" />
  </svg>
);

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Utility Components ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg ${className}`}>
    {children}
  </div>
);

const Badge = ({ type }) => {
  const colors = {
    Bullish: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Bearish: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[type] || colors.Neutral}`}>
      {type}
    </span>
  );
};

const formatNumber = (num) => {
  if (!num) return 'N/A';
  if (num >= 1.0e+12) return (num / 1.0e+12).toFixed(2) + "T";
  if (num >= 1.0e+9) return (num / 1.0e+9).toFixed(2) + "B";
  if (num >= 1.0e+6) return (num / 1.0e+6).toFixed(2) + "M";
  return num.toLocaleString();
};

function App() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [timeRange, setTimeRange] = useState('1M');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/analyze', {
        symbol: symbol
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze stock. Please check the symbol.");
    } finally {
      setLoading(false);
    }
  };

  const filteredChartData = useMemo(() => {
    if (!data?.market_data?.chart_data) return [];
    const chartData = data.market_data.chart_data;
    const totalDays = chartData.length;

    switch (timeRange) {
      case '1W': return chartData.slice(Math.max(0, totalDays - 7));
      case '1M': return chartData.slice(Math.max(0, totalDays - 30));
      case '3M': return chartData.slice(Math.max(0, totalDays - 90));
      case '1Y': return chartData;
      default: return chartData;
    }
  }, [data, timeRange]);

  const pieData = data?.sentiment_data?.distribution ? [
    { name: 'Bullish', value: data.sentiment_data.distribution.bullish, color: '#10b981' }, // Green
    { name: 'Neutral', value: data.sentiment_data.distribution.neutral, color: '#94a3b8' }, // Gray
    { name: 'Bearish', value: data.sentiment_data.distribution.bearish, color: '#ff4500' }, // Reddit Red
  ] : [];

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 p-4 md:p-8 font-sans selection:bg-reddit/30">

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12 text-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          {/* REVERTED: Using the Activity icon (Heartbeat/Chart) */}
          <div className="bg-slate-700/50 p-2 rounded-full">
            <Activity className="w-8 h-8 text-reddit" /> {/* Activity icon restored */}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Reddit Stock <span className="text-reddit">Analyzer</span>
          </h1>
        </motion.div>
        <p className="text-slate-400">Real-time market sentiment derived from Reddit discussions</p>
      </header>

      {/* Search Section - Changed gradient to blue */}
      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleAnalyze} className="relative group">
          {/* Changed gradient colors here to blue */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl opacity-50 blur group-hover:opacity-75 transition duration-200"></div>
          <div className="relative flex items-center bg-dark-800 rounded-xl p-2 border border-dark-700">
            <Search className="w-6 h-6 text-slate-400 ml-3" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., NVDA, GME)"
              className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-2 placeholder-slate-500 outline-none"
            />
            <button
              disabled={loading}
              type="submit"
              className="bg-reddit hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Dashboard */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* TOP ROW: Price & Fundamentals */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Price Card */}
            <Card className="md:col-span-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1">{data.symbol} Price</h3>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-white">
                      ${data.market_data?.price || 'N/A'}
                    </span>
                    {data.market_data && (
                      <span className={`flex items-center text-lg font-medium mb-1 ${data.market_data.percent_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {data.market_data.percent_change >= 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                        {data.market_data.percent_change}%
                      </span>
                    )}
                  </div>
                </div>

                {/* UPDATED RIGHT SIDE: Centered Stats */}
                <div className="space-y-2 min-w-[140px]">

                  {/* Market Cap - Centered */}
                  <div className="bg-dark-900/50 px-3 py-2 rounded-lg border border-dark-700 flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-500">Market Cap</p>
                    <p className="font-semibold text-blue-400">{formatNumber(data.market_data?.market_cap)}</p>
                  </div>

                  {/* Volume - Centered */}
                  <div className="bg-dark-900/50 px-3 py-2 rounded-lg border border-dark-700 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <p className="text-xs text-slate-500">Daily Vol.</p>
                      {data.market_data?.average_volume && data.market_data?.volume > (data.market_data?.average_volume * 1.2) && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded font-medium">High Vol</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-slate-200 leading-none">
                        {formatNumber(data.market_data?.volume)}
                      </p>
                      {data.market_data?.average_volume ? (
                        <p className="text-[10px] text-slate-500 mt-1">Avg: {formatNumber(data.market_data?.average_volume)}</p>
                      ) : null}
                    </div>
                  </div>

                </div>
              </div>
            </Card>

            {/* Sentiment Score */}
            <Card className="md:col-span-1">
              <h3 className="text-slate-400 text-sm font-medium mb-2">Reddit Sentiment</h3>
              {(() => {
                const rawScore = data.sentiment_data ? data.sentiment_data.average_sentiment : 0;

                // AMPLIFIED SCORE LOGIC:
                // Multiply by 1.5 to push "mild" sentiment towards the extremes
                let adjustedScore = rawScore * 1.5;
                // Clamp between -1 and 1
                adjustedScore = Math.max(-1, Math.min(1, adjustedScore));
                // Convert to 0-100 scale
                const score = Math.round((adjustedScore + 1) * 50);

                // Color logic: Red/Green for extremes, Gray for neutral
                let barColor;
                if (score >= 60) barColor = '#10b981'; // Bullish (Green)
                else if (score <= 40) barColor = '#ff4500'; // Bearish (Reddit Red)
                else barColor = '#94a3b8'; // Neutral (Gray)

                return (
                  <>
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-bold" style={{ color: barColor }}>{score}</span>
                      <span className="text-slate-500 text-sm mb-1">/ 100</span>
                    </div>
                    <div className="w-full bg-dark-700 h-2 mt-4 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-1000 ease-out"
                        style={{ width: `${score}%`, backgroundColor: barColor, boxShadow: `0 0 10px ${barColor}` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase tracking-wider">
                      <span>Bearish</span>
                      <span>Bullish</span>
                    </div>
                  </>
                );
              })()}
            </Card>

            {/* Discussion Volume */}
            <Card className="md:col-span-1">
              <h3 className="text-slate-400 text-sm font-medium mb-2">Discussion Volume</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white">{data.sentiment_data?.post_count || 0}</span>
                <span className="text-slate-500 text-sm mb-1">Posts</span>
              </div>
              <div className="flex items-start gap-2 mt-4 text-xs text-slate-400">
                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-reddit" />
                <span className="leading-relaxed">
                  {(() => {
                    const sources = data.sentiment_data?.sources || [];
                    if (sources.length === 0) return "From Reddit communities";
                    const displayList = sources.slice(0, 2).map(s => `r/${s}`);
                    return `From ${displayList.join(', ')} ${sources.length > 2 ? '& others' : ''}`;
                  })()}
                </span>
              </div>
            </Card>
          </div>

          {/* MIDDLE ROW: Chart & Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Price Chart */}
            <Card className="lg:col-span-2 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Price History</h3>
                <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700">
                  {['1W', '1M', '3M', '1Y'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === range
                          ? 'bg-reddit text-white'
                          : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredChartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        {/* Changed stopColor to blue-500 */}
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickFormatter={(str) => {
                        const date = new Date(str);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      domain={['auto', 'auto']}
                      tickFormatter={(number) => `$${number}`}
                    />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`$${value}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6" // Changed stroke to blue-500
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pie Chart */}
            <Card className="lg:col-span-1 min-h-[400px]">
              <h3 className="text-lg font-semibold text-white mb-6">Sentiment Distribution</h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Discussion List */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6">Top Discussions</h3>
            <div className="space-y-4">
              {data.sentiment_data?.top_posts?.map((post, index) => (
                <div key={index} className="group bg-dark-900/50 hover:bg-dark-900 border border-dark-700 p-4 rounded-lg transition-all">
                  <div className="flex justify-between items-start gap-4">

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge type={post.sentiment_label} />
                        <span className="text-xs text-reddit font-bold">r/{post.subreddit}</span>
                        <span className="text-xs text-slate-500">• {new Date(post.created_utc * 1000).toLocaleDateString()}</span>
                      </div>
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-slate-200 font-medium hover:text-reddit transition-colors line-clamp-2">
                        {post.title}
                      </a>
                    </div>

                    {/* Stats (Upvotes & Comments) */}
                    <div className="flex items-center gap-4 text-slate-400 bg-dark-800 px-3 py-2 rounded-lg border border-dark-700">
                      <div className="flex flex-col items-center min-w-[40px]">
                        <ArrowBigUp className="w-5 h-5 text-orange-500" />
                        <span className="text-xs font-bold text-white">{formatNumber(post.score)}</span>
                      </div>
                      <div className="w-px h-8 bg-dark-700"></div>
                      <div className="flex flex-col items-center min-w-[40px]">
                        <MessageCircle className="w-4 h-4 text-slate-400 mb-1" />
                        <span className="text-xs font-medium">{formatNumber(post.num_comments || 0)}</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default App;