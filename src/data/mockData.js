// Mock Data for LinkedIn Post Virality Predictor

export const INITIAL_STATS = {
  totalAnalyzed: 14,
  averageScore: 68,
  bestScore: 88,
  postsImproved: 6,
};

export const MOCK_WEAK_WORDS = [
  { name: 'synergy', value: 18, color: '#DC2626' },
  { name: 'deep dive', value: 15, color: '#E11D48' },
  { name: 'leverage', value: 12, color: '#F97316' },
  { name: 'paradigm shift', value: 9, color: '#F59E0B' },
  { name: 'disruptive', value: 8, color: '#D97706' },
  { name: 'game changer', value: 6, color: '#B45309' },
  { name: 'revolutionary', value: 5, color: '#A16207' },
];

export const MOCK_SCORE_HISTORY = [
  { date: 'May 20', score: 45 },
  { date: 'May 22', score: 58 },
  { date: 'May 24', score: 52 },
  { date: 'May 25', score: 72 },
  { date: 'May 26', score: 65 },
  { date: 'May 28', score: 78 },
  { date: 'May 29', score: 70 },
  { date: 'May 30', score: 82 },
  { date: 'Jun 01', score: 88 },
];

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    content: "🚀 We are thrilled to announce a paradigm shift in our synergy model. Let's do a deep dive and leverage our disruptive AI to revolutionize B2B solutions! What are your thoughts on this game-changing industry shift? Let me know below! 👇",
    score: 38,
    originalScore: 38,
    date: '2026-06-01',
    time: '14:30',
    status: 'Needs Work',
    estimatedReach: '500 - 1,200 views',
    readTime: '15 sec read',
    wordCount: 38,
    sentences: [
      { text: "🚀 We are thrilled to announce a paradigm shift in our synergy model.", type: 'weak', label: 'Weak' },
      { text: "Let's do a deep dive and leverage our disruptive AI to revolutionize B2B solutions!", type: 'weak', label: 'Weak' },
      { text: "What are your thoughts on this game-changing industry shift?", type: 'engaging', label: 'Engaging' },
      { text: "Let me know below! 👇", type: 'hook', label: 'Hook' }
    ],
    rewrites: [
      {
        id: 'rw-1',
        original: "🚀 We are thrilled to announce a paradigm shift in our synergy model.",
        suggested: "🚀 Today we're changing how our teams build products together.",
        explanation: "Removed jargon 'paradigm shift' and 'synergy model' for straightforward human language."
      },
      {
        id: 'rw-2',
        original: "Let's do a deep dive and leverage our disruptive AI to revolutionize B2B solutions!",
        suggested: "Here is a close look at how we use practical AI to speed up B2B workflows.",
        explanation: "Removed filler expressions like 'deep dive', 'leverage', and 'disruptive' to focus on benefits."
      }
    ],
    bestTime: 'Tuesday, 9:00 AM EST (Highest corporate professional engagement)'
  },
  {
    id: 'post-2',
    content: "Building in public is hard. 3 years ago, I had exactly 0 followers and absolute silence. Today, our SaaS reaches 100k users. Here are the 3 strict rules we followed to scale our startup without raising VC money. 🧵👇",
    score: 88,
    originalScore: 68,
    date: '2026-05-30',
    time: '09:15',
    status: 'Viral',
    estimatedReach: '25,000 - 80,000 views',
    readTime: '20 sec read',
    wordCount: 42,
    sentences: [
      { text: "Building in public is hard.", type: 'hook', label: 'Hook' },
      { text: "3 years ago, I had exactly 0 followers and absolute silence.", type: 'hook', label: 'Hook' },
      { text: "Today, our SaaS reaches 100k users.", type: 'engaging', label: 'Engaging' },
      { text: "Here are the 3 strict rules we followed to scale our startup without raising VC money. 🧵👇", type: 'engaging', label: 'Engaging' }
    ],
    rewrites: [],
    bestTime: 'Wednesday, 8:15 AM EST (Peak mid-week productivity scroll)'
  },
  {
    id: 'post-3',
    content: "Is work-from-home actually killing corporate culture? 🏢 Many CEOs claim that remote work reduces innovation, but statistics tell a completely different story. Let me know: do you prefer remote, hybrid, or in-office? Vote in the comments!",
    score: 72,
    originalScore: 54,
    date: '2026-05-28',
    time: '11:45',
    status: 'Viral',
    estimatedReach: '8,000 - 22,000 views',
    readTime: '25 sec read',
    wordCount: 40,
    sentences: [
      { text: "Is work-from-home actually killing corporate culture? 🏢", type: 'hook', label: 'Hook' },
      { text: "Many CEOs claim that remote work reduces innovation, but statistics tell a completely different story.", type: 'neutral', label: 'Neutral' },
      { text: "Let me know: do you prefer remote, hybrid, or in-office?", type: 'engaging', label: 'Engaging' },
      { text: "Vote in the comments!", type: 'engaging', label: 'Engaging' }
    ],
    rewrites: [],
    bestTime: 'Thursday, 12:00 PM EST (Lunch break scroll)'
  },
  {
    id: 'post-4',
    content: "We just finalized our product strategy. It's vital that we synergize our deliverables to maximize stakeholder ROI in a agile workspace. Thoughts?",
    score: 48,
    originalScore: 48,
    date: '2026-05-26',
    time: '17:10',
    status: 'Average',
    estimatedReach: '1,200 - 3,500 views',
    readTime: '10 sec read',
    wordCount: 22,
    sentences: [
      { text: "We just finalized our product strategy.", type: 'neutral', label: 'Neutral' },
      { text: "It's vital that we synergize our deliverables to maximize stakeholder ROI in a agile workspace.", type: 'weak', label: 'Weak' },
      { text: "Thoughts?", type: 'engaging', label: 'Engaging' }
    ],
    rewrites: [
      {
        id: 'rw-3',
        original: "It's vital that we synergize our deliverables to maximize stakeholder ROI in a agile workspace.",
        suggested: "Our main focus is delivering high-quality products that provide clear value to customers.",
        explanation: "Replaced 'synergize deliverables' and 'stakeholder ROI' with clear, conversational benefits."
      }
    ],
    bestTime: 'Monday, 10:00 AM EST (Morning review time)'
  }
];

export const MOCK_TESTIMONIALS = [
  {
    quote: "ViralScore literally saved my launch post. I was about to post a wall of text, but the sentence analysis flagged three key lines that were full of industry jargon. After replacing them, the post got 150k impressions and led to 42 demo requests!",
    author: "Elena Rostova",
    title: "Founder, GrowthFlow SaaS",
    initials: "ER",
    color: "bg-blue-600"
  },
  {
    quote: "As a creator, I post 5 times a week. Using the ScoreRing has turned content optimization into a game. If a post scores below 70, I rewrite it until it hits green. My average reach has jumped by over 240%. Best tool in my marketing arsenal.",
    author: "Marcus Vance",
    title: "LinkedIn Executive Coach",
    initials: "MV",
    color: "bg-emerald-600"
  },
  {
    quote: "I thought my hook was good until I pasted it here. The predictor flagged it as neutral and suggested an alternative starting sentence that led with a question. The engagement went through the roof. Fully worth adding to your workflow.",
    author: "Sarah Jenkins",
    title: "VP of Product, CloudTech",
    initials: "SJ",
    color: "bg-purple-600"
  }
];
