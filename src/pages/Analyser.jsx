import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, BarChart, Sparkles, Send, RefreshCw, HelpCircle, Calendar, ArrowRight } from 'lucide-react';
import ScoreRing from '../components/ScoreRing';
import SentenceChip from '../components/SentenceChip';
import RewriteCard from '../components/RewriteCard';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Analyser({ analyser, user }) {
  const {
    currentAnalysis,
    isLoading,
    analysePost,
    applyRewrite,
    loadPostToAnalyser,
    clearCurrentAnalysis
  } = analyser;

  const [inputText, setInputText] = useState('');

  // If a post is loaded into currentAnalysis, prefill editor with its content
  useEffect(() => {
    if (currentAnalysis) {
      setInputText(currentAnalysis.content);
    }
  }, [currentAnalysis]);

  // Handle changes in input text
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Word count and reading time helpers
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = inputText.length;
  const readTimeSeconds = Math.max(Math.ceil((wordCount / 180) * 60), 0);
  const readTimeStr = readTimeSeconds < 60 ? `${readTimeSeconds}s` : `${Math.ceil(readTimeSeconds/60)}m`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await analysePost(inputText);
  };

  const handleApplyRewrite = (originalText, newText) => {
    if (!currentAnalysis) return;
    // Replace inside local editor state
    const replaced = inputText.replace(originalText, newText);
    setInputText(replaced);
    
    // Apply changes in global hook state to recalculate score
    applyRewrite(currentAnalysis.id, originalText, newText);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Draft Analyser
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Write or paste your LinkedIn post draft to predict engagement metrics and correct style errors.
          </p>
        </div>

        {currentAnalysis && (
          <button
            onClick={() => {
              setInputText('');
              clearCurrentAnalysis();
            }}
            className="self-start md:self-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Editor
          </button>
        )}
      </div>

      {/* Main Content Workspace Split */}
      <div className="grid gap-8 lg:grid-cols-10 items-start">
        
        {/* Left Column: Post Input Editor (60% equivalent) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Compose Draft
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Max 3,000 characters
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Paste your LinkedIn draft here (e.g. 'We are thrilled to announce a paradigm shift in our synergy model. Let's do a deep dive and leverage our disruptive AI...')"
                  className="w-full min-h-[320px] rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-800 dark:bg-slate-950/20 dark:border-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/10 focus:outline-none transition-all resize-y"
                  maxLength={3000}
                />
              </div>

              {/* Real-time counters below textarea */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <BarChart className="mr-1 h-3.5 w-3.5" />
                    {wordCount} words
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {readTimeStr} read time
                  </span>
                </div>
                
                <span className={charCount > 2800 ? 'text-red-500' : 'text-slate-400'}>
                  {charCount.toLocaleString()} / 3,000 chars
                </span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3.5 font-bold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 fill-current" />
                    <span>Analyse Post</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* Right Column: Dynamic Analysis Report (40% equivalent) */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            
            {/* Loading Shimmer state */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Running AI Models</h3>
                <SkeletonLoader />
              </motion.div>
            )}

            {/* Active Analysis report display */}
            {!isLoading && currentAnalysis && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 space-y-6"
              >
                {/* Score */}
                <div className="text-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Virality Score</h3>
                  <ScoreRing score={currentAnalysis.score} />
                  
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Organic Reach</p>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {currentAnalysis.estimatedReach}
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Sentences pill highlights */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Sentence Analysis</h4>
                    <span className="text-[10px] text-slate-400 font-bold">Hover labels to learn more</span>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {currentAnalysis.sentences.map((sent, idx) => (
                      <SentenceChip key={idx} sentence={sent} />
                    ))}
                  </div>
                </div>

                {/* Posting Schedule */}
                {currentAnalysis.bestTime && (
                  <>
                    <hr className="border-slate-100 dark:border-slate-800" />
                    <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/20 p-4 border border-blue-150/40 dark:border-blue-900/30">
                      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Best Time to Post</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                        {currentAnalysis.bestTime}
                      </p>
                    </div>
                  </>
                )}

                {/* AI suggested rewrites */}
                {currentAnalysis.rewrites && currentAnalysis.rewrites.length > 0 && (
                  <>
                    <hr className="border-slate-100 dark:border-slate-800" />
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        AI Rewrite Suggestions ({currentAnalysis.rewrites.length})
                      </h4>
                      <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                        {currentAnalysis.rewrites.map((rw) => (
                          <RewriteCard
                            key={rw.id}
                            rewrite={rw}
                            onApply={() => handleApplyRewrite(rw.original, rw.suggested)}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

              </motion.div>
            )}

            {/* Empty state placeholder when no active post has been analysed */}
            {!isLoading && !currentAnalysis && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-slate-200 border-dashed bg-white dark:border-slate-800 dark:bg-slate-900/30 p-10 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-6 animate-float-fast">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">No Analysis Done</h3>
                <p className="text-xs leading-relaxed text-slate-400 max-w-[240px] mx-auto mb-6">
                  Write or paste your LinkedIn post draft on the left and tap the button to check it with AI.
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                    Awaiting Draft
                  </span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
