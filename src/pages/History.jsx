import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Zap, AlertCircle, RefreshCw, BarChart } from 'lucide-react';
import PostCard from '../components/PostCard';

export default function History({ analyser }) {
  const {
    posts,
    deletePost,
    loadPostToAnalyser
  } = analyser;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const navigate = useNavigate();

  const handleViewPost = (post) => {
    loadPostToAnalyser(post);
    navigate('/analyse');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter categorization
  const filteredPosts = posts.filter(post => {
    // Search query filter
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    if (activeFilter === 'Viral') {
      return matchesSearch && post.score >= 70;
    } else if (activeFilter === 'Average') {
      return matchesSearch && post.score >= 40 && post.score < 70;
    } else if (activeFilter === 'Needs Work') {
      return matchesSearch && post.score < 40;
    }
    
    return matchesSearch;
  });

  const filterTabs = ['All', 'Viral', 'Average', 'Needs Work'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
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
          Analysis Log
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Search, filter, delete, or retrieve historical post reports back to the text analyser workspace.
        </p>
      </div>

      {/* Control Row (Search & Filters) */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts by keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 focus:ring-1 focus:ring-blue-500/10 focus:outline-none transition-all placeholder-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeFilter === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 hover:bg-blue-700'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'Viral' ? 'Viral (70+)' : tab === 'Average' ? 'Average (40-69)' : tab === 'Needs Work' ? 'Needs Work (<40)' : 'All Posts'}
            </button>
          ))}
        </div>

      </div>

      {/* History Cards Grid Layout */}
      <AnimatePresence mode="popLayout">
        {filteredPosts.length > 0 ? (
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <PostCard
                  post={post}
                  onView={() => handleViewPost(post)}
                  onDelete={() => deletePost(post.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 border-dashed bg-white dark:border-slate-800 dark:bg-slate-900/30 p-16 text-center max-w-md mx-auto"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-455 mb-6 animate-float-fast">
              {searchQuery ? <AlertCircle className="h-6 w-6" /> : <BarChart className="h-6 w-6" />}
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              {searchQuery ? 'No Matching Results' : 'No Historic Analytics'}
            </h3>
            <p className="text-xs leading-relaxed text-slate-400 mb-6 max-w-[280px] mx-auto">
              {searchQuery 
                ? 'Try modifying your keyword search parameters or category filter selectors.'
                : 'A list of your analysed drafts will appear here. Start by writing in the Analyser!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
