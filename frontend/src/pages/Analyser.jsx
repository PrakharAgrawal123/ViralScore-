import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, BarChart, Sparkles, RefreshCw, Calendar } from 'lucide-react';
import ScoreRing from '../components/ScoreRing';
import SentenceChip from '../components/SentenceChip';
import RewriteCard from '../components/RewriteCard';
import SkeletonLoader from '../components/SkeletonLoader';
import FloatingOrbs from '../components/FloatingOrbs';

export default function Analyser({ analyser, user }) {
  const {
    currentAnalysis,
    isLoading,
    analysePost,
    applyRewrite,
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Draft Analyser
            </h1>
            <p className="text-white/50 text-base mt-1">
              Write or paste your LinkedIn post draft to predict engagement metrics and correct style errors.
            </p>
          </div>

          {currentAnalysis && (
            <button
              onClick={() => {
                setInputText('');
                clearCurrentAnalysis();
              }}
              className="self-start md:self-auto flex items-center gap-1.5 btn-glass px-3.5 py-2 text-sm font-semibold cursor-pointer transition-all"
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
            <div className="glass-card space-y-4">
              
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-[#6366F1]" />
                  <span className="text-base font-bold uppercase tracking-wider text-white/70">
                    Compose Draft
                  </span>
                </div>
                <span className="text-[15px] font-bold text-white/30">
                  Max 3,000 characters
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Paste your LinkedIn draft here (e.g. 'We are thrilled to announce a paradigm shift in our synergy model. Let's do a deep dive and leverage our disruptive AI...')"
                    className="w-full min-h-[280px] glass-input p-4 text-sm leading-relaxed text-white/90 placeholder:text-white/25 resize-y focus:outline-none"
                    maxLength={3000}
                  />
                  {/* Dynamic bottom border gradient progress bar */}
                  <div className="absolute bottom-0 left-0 w-full h-[3px] rounded-b-xl overflow-hidden pointer-events-none">
                    <div 
                      className="h-full transition-all duration-150"
                      style={{
                        width: `${(charCount / 3000) * 100}%`,
                        background: charCount > 2700 
                          ? 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899, #EF4444)' 
                          : charCount > 2000
                          ? 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)'
                          : 'linear-gradient(90deg, #6366F1, #8B5CF6)'
                      }}
                    />
                  </div>
                </div>

                {/* Real-time counters below textarea */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-white/55">
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
                  
                  <span className={charCount > 2800 ? 'text-red-500' : 'text-white/30'}>
                    {charCount.toLocaleString()} / 3,000 chars
                  </span>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl btn-glow py-3.5 font-bold disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all cursor-pointer"
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
                  className="glass-card"
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Running AI Models</h3>
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
                  className="glass-card space-y-6"
                >
                  {/* Score */}
                  <div className="text-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest gradient-text mb-4">Your Results</h3>
                    <ScoreRing score={currentAnalysis.score} />
                    
                    <div className="mt-4">
                      <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Estimated Organic Reach</p>
                      <p className="text-lg font-extrabold text-[#A5B4FC] mt-0.5">
                        {currentAnalysis.estimatedReach}
                      </p>
                    </div>
                  </div>

                  <hr className="border-white/5" />

                  {/* Sentences pill highlights */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Sentence Analysis</h4>
                      <span className="text-[15px] text-white/30 font-bold">Hover labels to learn more</span>
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
                      <hr className="border-white/5" />
                      <div className="rounded-xl bg-[#6366F1]/10 p-4 border border-[#6366F1]/20">
                        <div className="flex items-center space-x-2 text-[#A5B4FC] font-bold text-sm uppercase tracking-wider mb-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>Best Time to Post</span>
                        </div>
                        <p className="text-[15px] leading-relaxed text-white/70 font-medium">
                          {currentAnalysis.bestTime}
                        </p>
                      </div>
                    </>
                  )}

                  {/* AI suggested rewrites */}
                  {currentAnalysis.rewrites && currentAnalysis.rewrites.length > 0 && (
                    <>
                      <hr className="border-white/5" />
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">
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
                  className="rounded-2xl border border-white/10 border-dashed bg-white/5 p-10 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#A5B4FC] mb-6 animate-float-fast">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">No Analysis Done</h3>
                  <p className="text-sm leading-relaxed text-white/40 max-w-[240px] mx-auto mb-6">
                    Write or paste your LinkedIn post draft on the left and tap the button to check it with AI.
                  </p>
                  <div className="flex justify-center">
                    <span className="inline-flex items-center text-[13px] font-bold uppercase tracking-wider text-[#A5B4FC] bg-[#6366F1]/10 px-3 py-1.5 rounded-lg border border-[#6366F1]/20">
                      Awaiting Draft
                    </span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
