# Dayryze — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-03-20  
**Author:** Ruizhi (PM) + Sonny (AI)  
**Domain:** dayryze.com  
**GitHub:** github.com/ruizhi1201  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary
Dayryze is an AI-powered career transformation coach. It helps people who feel stuck, unfulfilled, or burned out in their current career to find clarity, explore new paths, discover startup ideas, and take actionable steps toward a better life.

### 1.2 Mission
Give everyone access to the kind of strategic career thinking that used to require expensive human coaches.

### 1.3 Elevator Pitch
> "Dayryze is the AI coach that helps you figure out what's next — whether that's a new career, a startup, or a completely different life."

---

## 2. Problem Statement

- 59% of US professionals were actively looking for a new job in 2024
- 57% of workers are planning a major career change
- Human career coaches cost $100–$500/session — unaffordable for most
- Existing tools are either job boards (reactive) or generic AI (not specialized)
- Most people don't have a trusted, knowledgeable person to think through career decisions with

**The gap:** An affordable, always-available, emotionally intelligent AI that helps people think through career transitions end-to-end.

---

## 3. Target Personas

### Persona 1 — The Burned-Out Achiever
- Age 28–38, good salary, successful on paper
- Feels empty, dreads Mondays
- Needs: permission to change + a realistic path out
- Willingness to pay: High

### Persona 2 — The Accidental Professional
- Age 25–35, fell into their career without intention
- Never chose this field, doesn't know what they actually want
- Needs: self-discovery tools, career options they haven't considered
- Willingness to pay: Medium

### Persona 3 — The Aspiring Entrepreneur
- Age 28–42, stable job but entrepreneurial itch
- Wants to build something but doesn't know where to start
- Needs: startup idea generation, validation framework, risk assessment
- Willingness to pay: High

### Persona 4 — The Industry Refugee
- Age 30–50, industry being disrupted by AI or market forces
- Skills feel obsolete, scared about the future
- Needs: transferable skills mapping, adjacent career paths
- Willingness to pay: High (urgency)

### Persona 5 — The Lifestyle Optimizer
- Age 30–45, job is fine but no longer fits their life
- Changed circumstances: new kid, moved cities, health issues
- Needs: flexible career alternatives, work-life redesign
- Willingness to pay: High

---

## 4. Goals & Success Metrics

### Business Goals
- 500 paying users within 6 months of launch
- $10,000 MRR within 6 months
- <5% monthly churn

### Product Metrics
| Metric | Target |
|--------|--------|
| Activation rate (3+ messages in first session) | >60% |
| Free → Paid conversion | >8% |
| Monthly active users (MAU) | >70% of paid users |
| NPS score | >50 |

---

## 5. Features & Requirements

### 5.1 Module 1 — Project Setup
- Next.js 14 app with TypeScript
- Tailwind CSS for styling
- GitHub repo: `dayryze`
- Vercel deployment (auto-deploy on push)
- Environment variable management

### 5.2 Module 2 — Authentication
- Email/password signup and login via Supabase Auth
- Google OAuth (optional v1.1)
- Protected routes — chat only accessible when logged in
- User profile: name, email, created date

### 5.3 Module 3 — AI Chatbot Core
**Conversation flows:**
1. **Career Change** — assessment → options → action plan
2. **Startup Idea** — background analysis → idea generation → validation
3. **Life Redesign** — values → vision → practical steps

**Behavior:**
- Warm, empathetic tone — not robotic
- Asks clarifying questions before giving advice
- Remembers context within a session
- Conversation history saved per user

**Free tier limits:**
- 10 conversations per week (resets every Monday)
- After limit reached, prompt to upgrade or refer a friend

**Referral Program:**
- Referrer gets: 7 days of Pro free when their friend signs up
- Referred friend gets: 7 days of Pro free on signup
- Both sides are rewarded — Dropbox-style double incentive
- After 7-day trial ends, user is prompted to subscribe to keep Pro access
- Referral tracked via unique referral link per user

### 5.4 Module 4 — Subscription & Billing (Stripe)
**Pricing tiers:**

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 10 conversations/week, Ray persona only |
| Growth | $19/mo | Unlimited conversations, all 4 personas (Ray, Sage, Nova, Ace) |
| Pro | $49/mo | Everything + structured 90-day program, action plans, priority features |

**Requirements:**
- Stripe Checkout for subscription creation
- Stripe Webhook to update user tier in database
- Subscription management page (cancel, upgrade, downgrade)
- Graceful paywall — show value before asking to pay

### 5.5 Module 5 — User Dashboard
- Conversation history list
- Resume/continue past conversations
- Current plan display + upgrade CTA
- Account settings (name, email, password)

### 5.6 Module 6 — Landing Page
- Clear hero: what Dayryze does and who it's for
- Social proof section (testimonials — placeholder for MVP)
- Pricing table (3 tiers)
- FAQ section
- CTA: "Start for free"
- SEO optimized (meta tags, OG image)

### 5.7 Module 7 — Polish & Launch
- Error handling (API failures, rate limits)
- Loading states throughout
- Mobile responsive
- Basic analytics (page views, signups, conversions)
- Production environment setup

---

## 6. Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| AI | OpenAI GPT-4o API |
| Database + Auth | Supabase (PostgreSQL) |
| Payments | Stripe |
| Hosting | Vercel |
| Version control | GitHub |

---

## 7. User Stories

### Authentication
- As a visitor, I can sign up with email and password
- As a user, I can log in and my session persists
- As a user, I can reset my password via email

### Chatbot
- As a free user, I can have up to 5 conversations with the AI
- As a user, I can choose which type of help I want (career change / startup / life redesign)
- As a user, I can see my past conversations and continue them
- As a paid user, I have unlimited conversations

### Payments
- As a free user, I see a clear upgrade prompt when I hit my limit
- As a user, I can subscribe to Growth or Pro plan via Stripe Checkout
- As a paid user, I can manage or cancel my subscription
- As a user, my tier updates immediately after payment

### Landing Page
- As a visitor, I understand what Dayryze does within 5 seconds
- As a visitor, I can see pricing before signing up
- As a visitor, I can start for free with no credit card required

---

## 8. Out of Scope (v1)

- Mobile app (iOS/Android)
- WhatsApp integration (planned for v2)
- Human coach marketplace
- Team/enterprise plans
- Social features (sharing, community)
- Multi-language support

---

## 9. Design Principles

1. **Hope-first** — every touchpoint should feel like a new beginning, not a problem to fix
2. **Warm not clinical** — conversational, human tone throughout
3. **Action-oriented** — always end with something the user can do next
4. **Low friction** — get users to their first valuable moment as fast as possible

---

## 10. Launch Plan

| Phase | Timeline | Goal |
|-------|----------|------|
| Build MVP | Weeks 1–3 | Working product with all 7 modules |
| Soft launch | Week 4 | 50 free users, gather feedback |
| Product Hunt | Week 6 | Public launch, 500+ signups |
| Content marketing | Month 2+ | TikTok/Reels, SEO blog |
| Paid acquisition | Month 4+ | Once conversion rates confirmed |

---

## 11. Open Questions

- [ ] Will Ruizhi appear on camera for marketing content, or go fully faceless?
- [ ] Should free tier reset monthly or be a lifetime limit?
- [ ] What's the system prompt / persona name for the AI coach?
- [ ] Do we want a waitlist before launch or open signup?

---

*This document is a living reference. Update as decisions are made.*
