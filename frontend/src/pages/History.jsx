import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, RefreshCw, BarChart } from 'lucide-react';
import PostCard from '../components/PostCard';
import FloatingOrbs from '../components/FloatingOrbs';

export default function History({ analyser, theme }) {
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
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            <span className="gradient-text">Analysis Log</span>
          </h1>
          <p className="text-slate-500 dark:text-white/50 text-base mt-1 font-sans">
            Search, filter, delete, or retrieve historical post reports back to the text analyser workspace.
          </p>
        </div>

        {/* Control Row (Search & Filters) */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-white/5">
          
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-white/30">
              <Search className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search posts by keyword..."
              className="w-full pl-10 pr-4 py-2.5 glass-input text-base text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-bold cursor-pointer transition-all ${
                  activeFilter === tab
                    ? 'btn-glow text-white shadow-sm'
                    : 'btn-glass text-slate-600 dark:text-slate-300'
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
                  exit={{ opacity: 0, scale: 0.9, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
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
              className="rounded-2xl border border-slate-205 dark:border-white/10 border-dashed bg-slate-100/30 dark:bg-white/5 p-16 text-center max-w-md mx-auto"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/50 dark:bg-white/5 text-indigo-600 dark:text-[#A5B4FC] mb-6 animate-float-fast">
                {searchQuery ? <AlertCircle className="h-6 w-6" /> : <BarChart className="h-6 w-6" />}
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                {searchQuery ? 'No Matching Results' : 'No Historic Analytics'}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-white/40 mb-6 max-w-[280px] mx-auto font-semibold">
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
                  className="inline-flex items-center gap-1.5 btn-glass px-4 py-2 text-sm font-semibold cursor-pointer transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
