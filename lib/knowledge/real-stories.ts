// Real-world career stories sourced from public Reddit discussions
// Privacy preserved — no usernames, identifying details removed
// Used to ground AI coaching in authentic human experience

export const realStories = {
  // For Ray — emotional, life change stories
  ray: [
    {
      theme: "pay cut worth it",
      story: "Someone was making $212k but was miserable — hated themselves and their life. Took a job at $185k just to escape a toxic manager. Called it the best decision of their life. Said they went from working with 'third stringers' to an A+ team. The $27k cut felt huge on paper but irrelevant in practice.",
      insight: "Money doesn't fix a bad environment. Sometimes a pay cut IS the raise — in sanity, energy, and self-respect.",
    },
    {
      theme: "career change after 30",
      story: "A teacher burned out and switched careers before starting a family. Said they needed better work-life balance and the career change made them so happy they did it. No regrets mentioned.",
      insight: "Life transitions (new family, health, moving) often force the question people avoided for years. The timing rarely feels right but it's usually now or never.",
    },
    {
      theme: "late career pivot",
      story: "Someone spent 10 years in an industry they never loved. Industry salaries started dropping. Finally decided to pivot to something they at least liked — reasoning that money follows genuine interest because you get really good at what you enjoy.",
      insight: "People often stay in careers they don't like because the money is good. But when the money stops being good, it forces clarity. The pivot happens — just later and with more sunk cost.",
    },
    {
      theme: "entry level at 30",
      story: "After years in retail management, someone took an entry-level bankruptcy legal analyst job. Took a pay cut. Called it their first real office job and said they loved it. The drop in status and pay felt worth it for the change in direction.",
      insight: "Going 'backwards' on paper can feel humiliating. But most people who do it say the pride hit was temporary and the new energy was real.",
    },
  ],

  // For Sage — strategic, analytical career transition insights
  sage: [
    {
      theme: "transferable skills undervalued",
      story: "People consistently underestimate how transferable their skills are. A retail manager has people management, operations, sales, conflict resolution — all valuable in corporate roles. The problem isn't the skills, it's how they're framed on a resume and in interviews.",
      insight: "The question isn't 'do I have the skills' — it's 'am I translating them into language the new industry understands.' Most career changers have more than they think.",
    },
    {
      theme: "industry vs role confusion",
      story: "Many people confuse hating their industry with hating their role — or vice versa. A burned-out lawyer might love analytical work but hate law. Moving to a finance analyst role solves the problem. A bored accountant might love numbers but hate corporate culture — freelancing solves it without retraining.",
      insight: "Before planning a full career change, it's worth diagnosing: is it the role, the industry, the company, or the boss? Each has a different fix.",
    },
    {
      theme: "the 6-month bridge plan",
      story: "The most successful career changers rarely quit cold. They spend 6 months building the bridge — taking courses at night, doing freelance work on weekends, networking in the new field — before making the jump. The people who quit first and figure it out later often take 2x as long.",
      insight: "The bridge plan feels slower but actually gets you there faster. And it reduces the financial terror that makes people freeze.",
    },
  ],

  // For Nova — startup, entrepreneurship stories
  nova: [
    {
      theme: "quit job start business fear",
      story: "The fear before starting is almost always bigger than the reality. Most founders describe the moment of quitting as terrifying — and then a week later, oddly calm. The anticipation is worse than the jump. The real challenges come later and they're different ones than you imagined.",
      insight: "Fear of the jump is not a signal to wait. It's just the brain's threat response to uncertainty. The people who wait for the fear to go away wait forever.",
    },
    {
      theme: "failed startup lessons",
      story: "A huge portion of successful second-time founders had a failed first venture. The failure taught them: don't build before validating, don't hire too fast, don't raise money before product-market fit. The loss of the first business was the tuition for the second one.",
      insight: "Failure isn't the opposite of success in startups — it's usually the prerequisite. The question isn't whether you'll fail, it's whether you'll learn from it fast enough.",
    },
    {
      theme: "side project to business",
      story: "Many successful small businesses started as side projects that people weren't even trying to monetize. A blog became a consulting business. A weekend tool became a SaaS product. The pattern: they built something for themselves, other people wanted it, money followed.",
      insight: "The best startup ideas often don't feel like startup ideas at first. They feel like scratching your own itch. If you're solving a problem you genuinely have, there are probably others with the same problem.",
    },
  ],

  // For Ace — blunt, street-smart career realities
  ace: [
    {
      theme: "nobody cares about your degree",
      story: "In most fields after 3-5 years, nobody looks at your degree anymore. They look at what you've shipped, built, or managed. A portfolio beats a diploma every time in tech, design, marketing, and increasingly in business roles too.",
      insight: "Stop hiding behind credentials you don't have. Start building proof you do have. One good project beats a semester of coursework.",
    },
    {
      theme: "toxic boss is real",
      story: "Someone took a $27k pay cut just to escape a toxic manager. They said they hated themselves and their life — not just their job. Moving to a better team felt like a different career entirely, same role, same industry.",
      insight: "People don't leave jobs, they leave managers. If you're miserable, before you blow up your whole career, ask: is it the work or is it this specific person? Sometimes one conversation or one transfer fixes everything.",
    },
    {
      theme: "the job market reality",
      story: "Most job listings are wishful thinking. Companies post for a unicorn, get no applicants, then hire someone with 60% of the requirements who seemed confident in the interview. The 'years of experience required' is almost always negotiable if you can show you can do the actual work.",
      insight: "Apply for jobs you're underqualified for on paper. Requirements are a wish list, not a contract. The real filter is: can you do the job? Show that in the interview.",
    },
    {
      theme: "networking truth",
      story: "Most people who successfully changed careers did it through someone they knew — not job boards. A referral gets you past the resume filter. A coffee chat gives you intel nobody posts publicly. The hidden job market is real and it's bigger than what's on LinkedIn.",
      insight: "You're not applying yourself out of career hell. You're networking yourself out. Every job application with no connection is a lottery ticket. Referrals are a key.",
    },
  ],
}

export type PersonaStories = typeof realStories
