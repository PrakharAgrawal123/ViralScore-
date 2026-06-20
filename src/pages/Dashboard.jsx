import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { FileText, TrendingUp, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import FloatingOrbs from '../components/FloatingOrbs';

export default function Dashboard({ analyser }) {
  const {
    posts,
    stats,
    weakWords,
    scoreHistory,
    loadPostToAnalyser
  } = analyser;

  const navigate = useNavigate();

  // Load a historic post back into the editor
  const handleRowClick = (post) => {
    loadPostToAnalyser(post);
    navigate('/analyse');
  };

  // Card staggered parent metrics
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Get status color badges
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Viral':
        return 'bg-emerald-500/10 text-[#6EE7B7] border-emerald-500/20';
      case 'Needs Work':
        return 'bg-red-500/10 text-[#FCA5A5] border-red-500/20';
      default:
        return 'bg-amber-500/10 text-[#FCD34D] border-amber-500/20';
    }
  };

  const truncateText = (text, len = 60) => {
    if (text.length <= len) return text;
    return text.slice(0, len) + '...';
  };

  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98, filter: "blur(4px)" },
    animate: { 
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, y: -20, scale: 1.02, filter: "blur(4px)",
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ position: "relative", overflow: "hidden" }}
      className="min-h-screen"
    >
      <FloatingOrbs />
      
      <div style={{ position: "relative", zIndex: 1 }} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="gradient-text">Creator Dashboard</span>
          </h1>
          <p className="text-white/50 text-base mt-1">
            Monitor your cumulative analytics, historic score updates, and frequently flagged jargon words.
          </p>
        </div>

        {/* Grid of 4 Numeric Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          <MetricCard
            title="Total Posts Analysed"
            value={stats.totalAnalyzed}
            subtext="Cumulative post drafts checked"
            icon={FileText}
          />
          <MetricCard
            title="Average Virality Score"
            value={`${stats.averageScore}/100`}
            subtext="Healthy standard benchmark"
            icon={TrendingUp}
            trend={{ value: '+4.2%', type: 'positive' }}
          />
          <MetricCard
            title="Best Score Ever"
            value={stats.bestScore}
            subtext="Top calculated potential post"
            icon={Award}
          />
          <MetricCard
            title="Posts Improved"
            value={stats.postsImproved}
            subtext="Fixed jargon lines after suggestions"
            icon={Sparkles}
          />
        </motion.div>

        {/* Charts Split Layout */} 
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          
          {/* Score Over Time Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Score Over Time</h3>
                <h4 className="text-lg font-bold text-white mt-0.5">Draft Quality Trend</h4>
              </div>
            </div>
            
            <div className="h-72 w-full">
              {scoreHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={11} 
                      fontWeight={600} 
                      tick={{ fill: "rgba(255,255,255,0.4)" }}
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={11} 
                      fontWeight={600} 
                      tick={{ fill: "rgba(255,255,255,0.4)" }}
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{
                        background: "rgba(13,13,26,0.9)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                        color: "#fff"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={{ fill: "#6366F1", stroke: "rgba(99,102,241,0.3)", strokeWidth: 6, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#8B5CF6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/40 text-xs">
                  No scores available. Analyse a post to generate graphs.
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Weak Words Used Horizontal Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Jargon Analytics</h3>
                <h4 className="text-lg font-bold text-white mt-0.5">Most Flagged Weak Words</h4>
              </div>
            </div>
            
            <div className="h-72 w-full">
              {weakWords.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weakWords} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis 
                      type="number" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={11} 
                      fontWeight={600} 
                      tick={{ fill: "rgba(255,255,255,0.4)" }}
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={11} 
                      fontWeight={600} 
                      tick={{ fill: "rgba(255,255,255,0.4)" }}
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(13,13,26,0.9)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                        color: "#fff"
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16} fill="url(#barGradient)">
                      {weakWords.map((entry, index) => (
                        <Cell key={`cell-${index}`} style={{ transition: 'fill-opacity 0.2s ease' }} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/40 text-xs">
                  No jargon occurrences found. Nice writing!
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Recent Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card overflow-hidden !p-0"
        >
          <div className="p-6 border-b border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Activity Logs</h3>
            <h4 className="text-lg font-bold text-white mt-0.5">Recently Checked Posts</h4>
          </div>
          
          <div className="overflow-x-auto">
            {posts.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-xs font-bold uppercase tracking-wider text-white/50 border-b border-white/5">
                    <th className="p-4 pl-6">Post Preview</th>
                    <th className="p-4">Virality Score</th>
                    <th className="p-4">Date Checked</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-medium">
                  {posts.slice(0, 5).map((post) => (
                    <tr
                      key={post.id}
                      onClick={() => handleRowClick(post)}
                      className="hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <td className="p-4 pl-6 text-white/80 max-w-sm truncate pr-8">
                        {truncateText(post.content)}
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-white">{post.score}</span>
                        <span className="text-[10px] text-white/40 font-bold uppercase ml-0.5">/100</span>
                      </td>
                      <td className="p-4 text-white/50 text-xs">
                        {post.date}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${getBadgeStyle(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6 text-xs text-[#6366F1] group-hover:translate-x-0.5 transition-transform flex justify-end items-center gap-0.5 pt-5 cursor-pointer">
                        <span>Analyse</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-white/40 text-xs font-semibold">
                No historical data available. Go to the Analyser page to create records!
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
