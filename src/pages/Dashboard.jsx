import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { FileText, TrendingUp, Sparkles, Award, ArrowUpRight, HelpCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';

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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'Needs Work':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
    }
  };

  const truncateText = (text, len = 60) => {
    if (text.length <= len) return text;
    return text.slice(0, len) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Creator Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
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
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Score Over Time</h3>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">Draft Quality Trend</h4>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {scoreHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    fontWeight={600} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    fontWeight={600} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563EB" // Slate primary blue
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
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
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Jargon Analytics</h3>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">Most Flagged Weak Words</h4>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {weakWords.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weakWords} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    fontWeight={600} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                    {weakWords.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#2563EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
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
        className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Activity Logs</h3>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">Recently Checked Posts</h4>
        </div>
        
        <div className="overflow-x-auto">
          {posts.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 pl-6">Post Preview</th>
                  <th className="p-4">Virality Score</th>
                  <th className="p-4">Date Checked</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-medium">
                {posts.slice(0, 5).map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => handleRowClick(post)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 pl-6 text-slate-700 dark:text-slate-350 max-w-sm truncate pr-8">
                      {truncateText(post.content)}
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-850 dark:text-slate-200">{post.score}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">/100</span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {post.date}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${getBadgeStyle(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 text-xs text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex justify-end items-center gap-0.5 pt-5">
                      <span>Analyse</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              No historical data available. Go to the Analyser page to create records!
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}
