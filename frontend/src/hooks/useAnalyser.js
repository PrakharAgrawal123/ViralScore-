import { useState, useEffect } from 'react';
import { INITIAL_POSTS, INITIAL_STATS, MOCK_WEAK_WORDS, MOCK_SCORE_HISTORY } from '../data/mockData';

// Helper to check for common jargon
const JARGON_REPLACEMENTS = [
  { word: 'paradigm shift', replacement: 'fundamental change', reason: 'Too corporate and vague' },
  { word: 'synergy', replacement: 'collaboration', reason: 'Overused buzzword' },
  { word: 'synergize', replacement: 'collaborate / align', reason: 'High corporate jargon factor' },
  { word: 'deep dive', replacement: 'close look / analysis', reason: 'Cliché filler phrase' },
  { word: 'leverage', replacement: 'use / build on', reason: 'Overused marketing term' },
  { word: 'disruptive', replacement: 'innovative / unique', reason: 'Lacks actual descriptive meaning' },
  { word: 'game changer', replacement: 'important step', reason: 'Sensationalist and overplayed' },
  { word: 'game-changing', replacement: 'important', reason: 'Sensationalist and overplayed' },
  { word: 'revolutionary', replacement: 'new / advanced', reason: 'Sounds like hyperbole' },
  { word: 'stakeholder', replacement: 'client / partner', reason: 'Very bureaucratic' },
  { word: 'maximize ROI', replacement: 'improve results', reason: 'Sounds dry and spreadsheet-driven' },
  { word: 'deliverables', replacement: 'products / output', reason: 'Sounds like office speak' },
  { word: 'agile workspace', replacement: 'flexible team environment', reason: 'Overused process buzzword' }
];

export default function useAnalyser() {
  const [posts, setPosts] = useState(() => {
    const local = localStorage.getItem('viralscore_posts');
    return local ? JSON.parse(local) : INITIAL_POSTS;
  });

  const [stats, setStats] = useState(() => {
    const local = localStorage.getItem('viralscore_stats');
    return local ? JSON.parse(local) : INITIAL_STATS;
  });

  const [weakWords, setWeakWords] = useState(() => {
    const local = localStorage.getItem('viralscore_weak_words');
    return local ? JSON.parse(local) : MOCK_WEAK_WORDS;
  });

  const [scoreHistory, setScoreHistory] = useState(() => {
    const local = localStorage.getItem('viralscore_history');
    return local ? JSON.parse(local) : MOCK_SCORE_HISTORY;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('viralscore_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('viralscore_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('viralscore_weak_words', JSON.stringify(weakWords));
  }, [weakWords]);

  useEffect(() => {
    localStorage.setItem('viralscore_history', JSON.stringify(scoreHistory));
  }, [scoreHistory]);

  // Split content into clean sentences
  const splitSentences = (text) => {
    if (!text) return [];
    // Match sentences ending with punctuation or end of string
    const sentenceRegex = /[^.!?]+[.!?]*/g;
    const matches = text.match(sentenceRegex) || [text];
    return matches.map(s => s.trim()).filter(s => s.length > 0);
  };

  // Perform the core analysis
  const analysePost = async (content) => {
    setIsLoading(true);
    // Simulate high-end AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const sentenceStrings = splitSentences(content);
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readTimeSeconds = Math.max(Math.ceil((wordCount / 180) * 60), 3); // 180 WPM
    const readTimeStr = readTimeSeconds < 60 ? `${readTimeSeconds} sec read` : `${Math.ceil(readTimeSeconds/60)} min read`;

    let score = 55; // Base virality starting score
    const detectedWeakWords = [];
    const sentences = [];
    const rewrites = [];

    // Analyze sentence-by-sentence
    sentenceStrings.forEach((sentence, index) => {
      let type = 'neutral';
      let label = 'Neutral';

      // Check jargon
      let hasJargon = false;
      let matchedJargon = null;

      JARGON_REPLACEMENTS.forEach(item => {
        if (sentence.toLowerCase().includes(item.word)) {
          hasJargon = true;
          matchedJargon = item;
          detectedWeakWords.push(item.word);
        }
      });

      // Classification priorities
      if (hasJargon) {
        type = 'weak';
        label = 'Weak';
        score -= 7; // Penalty for jargon

        // Create a suggested rewrite
        if (matchedJargon) {
          const regex = new RegExp(matchedJargon.word, 'gi');
          const suggestedText = sentence.replace(regex, matchedJargon.replacement);
          rewrites.push({
            id: `rw-${index}-${Date.now()}`,
            original: sentence,
            suggested: suggestedText,
            explanation: matchedJargon.reason
          });
        }
      } else if (sentence.endsWith('?') || sentence.toLowerCase().includes('let me know') || sentence.toLowerCase().includes('comment')) {
        type = 'engaging';
        label = 'Engaging';
        score += 6; // Bonus for engaging calls-to-action or questions
      } else if (index === 0 || (index === 1 && sentenceStrings.length > 2 && sentence.length < 90)) {
        // High hook potential if short and early
        type = 'hook';
        label = 'Hook';
        score += 8;
      }

      sentences.push({ text: sentence, type, label });
    });

    // Additional global scoring factors
    // Multi-line spacing check (creators use single lines for readability)
    const lineBreaks = (content.match(/\n/g) || []).length;
    if (lineBreaks > 3) {
      score += 5; // Clean formatting bonus
    }
    
    // Emojis check
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const emojiCount = (content.match(emojiRegex) || []).length;
    if (emojiCount >= 2 && emojiCount <= 8) {
      score += 6; // Good emoji density bonus
    } else if (emojiCount > 10) {
      score -= 3; // Emoji spam penalty
    }

    // Number statistics check (data helps virality)
    const hasNumbers = /\b\d+(k|m|%|)?\b/i.test(content);
    if (hasNumbers) {
      score += 7; // Statistics bonus
    }

    // Cap score safely between 22 and 98
    score = Math.max(22, Math.min(98, score));

    // Determine status badge
    let status = 'Average';
    let estimatedReach;
    if (score >= 70) {
      status = 'Viral';
      estimatedReach = `${(score * 400).toLocaleString()} - ${(score * 1200).toLocaleString()} views`;
    } else if (score < 40) {
      status = 'Needs Work';
      estimatedReach = '200 - 800 views';
    } else {
      estimatedReach = `${(score * 80).toLocaleString()} - ${(score * 180).toLocaleString()} views`;
    }

    // Determine optimal post time dynamically
    const postingWindows = [
      'Tuesday, 8:45 AM EST (Peak mid-week professional engagement)',
      'Wednesday, 9:15 AM EST (Optimal lunch break scrolling hour)',
      'Thursday, 12:30 PM EST (Afternoon professional catch-up window)',
      'Monday, 10:00 AM EST (Weekly corporate strategy review session)'
    ];
    const bestTime = postingWindows[Math.floor(Math.random() * postingWindows.length)];

    const dateToday = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toTimeString().slice(0, 5);

    const newPost = {
      id: `post-${Date.now()}`,
      content,
      score,
      originalScore: score, // To trace if improved later
      date: dateToday,
      time: timeNow,
      status,
      estimatedReach,
      readTime: readTimeStr,
      wordCount,
      sentences,
      rewrites,
      bestTime
    };

    // Update posts state
    setPosts(prev => [newPost, ...prev]);

    // Recalculate global stats
    setStats(prev => {
      const updatedTotal = prev.totalAnalyzed + 1;
      const allPosts = [newPost, ...posts];
      const sumScores = allPosts.reduce((acc, curr) => acc + curr.score, 0);
      const updatedAverage = Math.round(sumScores / updatedTotal);
      const updatedBest = Math.max(prev.bestScore, score);
      
      return {
        totalAnalyzed: updatedTotal,
        averageScore: updatedAverage,
        bestScore: updatedBest,
        postsImproved: prev.postsImproved
      };
    });

    // Update Weak Word frequency list
    setWeakWords(prev => {
      const updated = [...prev];
      detectedWeakWords.forEach(word => {
        const found = updated.find(w => w.name.toLowerCase() === word.toLowerCase());
        if (found) {
          found.value += 1;
        } else {
          updated.push({
            name: word,
            value: 1,
            color: '#B45309'
          });
        }
      });
      return updated.sort((a, b) => b.value - a.value).slice(0, 7);
    });

    // Add to chart history array
    setScoreHistory(prev => {
      const dateLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      // If we already have this date, update the score, otherwise append
      const existingIndex = prev.findIndex(item => item.date === dateLabel);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].score = Math.max(updated[existingIndex].score, score);
        return updated;
      } else {
        const updated = [...prev, { date: dateLabel, score }];
        if (updated.length > 10) updated.shift(); // Keep last 10 points
        return updated;
      }
    });

    setCurrentAnalysis(newPost);
    setIsLoading(false);
    return newPost;
  };

  // Delete a post from history
  const deletePost = (id) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    
    // Adjust stats
    setStats(prev => {
      const remainingPosts = posts.filter(post => post.id !== id);
      if (remainingPosts.length === 0) {
        return { totalAnalyzed: 0, averageScore: 0, bestScore: 0, postsImproved: 0 };
      }
      const sumScores = remainingPosts.reduce((acc, curr) => acc + curr.score, 0);
      const avg = Math.round(sumScores / remainingPosts.length);
      const best = remainingPosts.reduce((acc, curr) => Math.max(acc, curr.score), 0);
      return {
        ...prev,
        totalAnalyzed: remainingPosts.length,
        averageScore: avg,
        bestScore: best
      };
    });
  };

  // Update a post inside history after rewrite copy
  const applyRewrite = (postId, originalText, newText) => {
    let updatedPostObj = null;

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      // Replace the sentence in the post content
      const updatedContent = post.content.replace(originalText, newText);

      // Re-evaluate sentence highlights
      const updatedSentences = post.sentences.map(s => {
        if (s.text === originalText) {
          // It's no longer weak! Classify it as positive/hook/neutral
          let type = 'neutral';
          let label = 'Neutral';
          if (newText.endsWith('?') || newText.toLowerCase().includes('let me know')) {
            type = 'engaging';
            label = 'Engaging';
          }
          return { text: newText, type, label };
        }
        return s;
      });

      // Remove this rewrite option since it was applied
      const updatedRewrites = post.rewrites.filter(r => r.original !== originalText);

      // Recalculate score (increase score for fixing jargon!)
      let newScore = post.score + 10;
      newScore = Math.min(98, newScore);

      // Determine updated status
      let status = 'Average';
      let estimatedReach;
      if (newScore >= 70) {
        status = 'Viral';
        estimatedReach = `${(newScore * 400).toLocaleString()} - ${(newScore * 1200).toLocaleString()} views`;
      } else if (newScore < 40) {
        status = 'Needs Work';
        estimatedReach = '200 - 800 views';
      } else {
        estimatedReach = `${(newScore * 80).toLocaleString()} - ${(newScore * 180).toLocaleString()} views`;
      }

      // If it went up, update "posts improved" stat
      if (newScore > post.originalScore) {
        setStats(prev => ({
          ...prev,
          postsImproved: prev.postsImproved + 1
        }));
      }

      const updated = {
        ...post,
        content: updatedContent,
        score: newScore,
        status,
        estimatedReach,
        sentences: updatedSentences,
        rewrites: updatedRewrites
      };
      
      updatedPostObj = updated;
      return updated;
    }));

    if (updatedPostObj && currentAnalysis && currentAnalysis.id === postId) {
      setCurrentAnalysis(updatedPostObj);
    }
  };

  const loadPostToAnalyser = (post) => {
    setCurrentAnalysis(post);
  };

  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
  };

  return {
    posts,
    stats,
    weakWords,
    scoreHistory,
    isLoading,
    currentAnalysis,
    analysePost,
    deletePost,
    applyRewrite,
    loadPostToAnalyser,
    clearCurrentAnalysis
  };
}
