# Dayryz — Product Requirements Document

**Version:** 1.1  
**Date:** 2026-03-21  
**Author:** Ruizhi (PM) + Sonny (AI)  
**Domain:** dayryz.com  
**GitHub:** github.com/ruizhi1201/dayryze  
**Status:** Active

---

## 1. Overview

### 1.1 Product Summary
Dayryz is an AI-powered career transformation coach. It helps people who feel stuck, unfulfilled, or burned out in their current career to find clarity, explore new paths, discover startup ideas, and take actionable steps toward a better life.

### 1.2 Mission
Give everyone access to the kind of strategic career thinking that used to require expensive human coaches.

### 1.3 Elevator Pitch
> "Dayryz is the AI coach that helps you figure out what's next — whether that's a new career, a startup, or a completely different life."

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

## 5. Core Differentiators (vs generic ChatGPT)

Three pillars that make Dayryz feel like a real coach, not a chatbot:

### 5.1 Structured Onboarding (All Users)
- Before any chat, users complete a structured profile: work history, skills, values, lifestyle goals, income needs, risk tolerance
- The AI uses this profile from the very first message — it *knows* you
- Free users: profile used within that session only (not saved)
- Paid users: profile saved permanently and injected into every future session
- **Effect:** Free users experience the "wow" of a personalized AI; when it forgets them next session, the gap between free and paid becomes visceral — not abstract

### 5.2 Persistent Memory (Paid Only)
- Paid users' profiles and conversation history are saved in Supabase
- Every session picks up where the last left off
- AI references past discussions, tracks progress, holds the user accountable
- Free users see this message when they return: *"I don't have memory of our previous conversations. Upgrade to Dayryz Pro to unlock persistent coaching memory."*

### 5.3 Accountability Check-ins (Paid Only)
- Weekly nudges based on goals the user set
- "You said you'd update your LinkedIn by Friday. How did it go?"
- Turns a chat tool into an ongoing coaching relationship

---

## 6. Features & Requirements

### 6.1 Module 1 — Project Setup
- Next.js 14 app with TypeScript
- Tailwind CSS for styling
- GitHub repo: `dayryze`
- Vercel deployment (auto-deploy on push)
- Environment variable management

### 6.2 Module 2 — Authentication
- Email/password signup and login via Supabase Auth
- Google OAuth (optional v1.1)
- Protected routes — chat only accessible when logged in
- User profile: name, email, created date, is_paid flag

### 6.3 Module 3 — Structured Onboarding
**Available to all users (free + paid)**

Onboarding collects:
- Current job / industry
- Years of experience
- Key skills
- Values (what matters most in work)
- Lifestyle goals (income, flexibility, location, etc.)
- Risk tolerance
- What kind of help they need (career change / startup / life redesign)

**Free users:** Profile used in current session only, not persisted  
**Paid users:** Profile saved to Supabase, loaded at every future session

### 6.4 Module 4 — AI Chatbot Core
**Conversation flows:**
1. **Career Change** — assessment → options → action plan
2. **Startup Idea** — background analysis → idea generation → validation
3. **Life Redesign** — values → vision → practical steps

**Behavior:**
- Warm, empathetic tone — not robotic
- Asks clarifying questions before giving advice
- Uses onboarding profile as context from message one
- Conversation history saved per session

**AI Model:**
- Free tier: GPT-4o mini (cost-efficient)
- Paid tier: GPT-4o full (best quality)

**Free tier limits:**
- 5 sessions per month (resets on 1st of each month)
- After limit: prompt to upgrade

### 6.5 Module 5 — Subscription & Billing (Stripe)
**Pricing tiers (v1):**

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 5 sessions/month, onboarding profile (session only), GPT-4o mini |
| Pro | $19/mo | Unlimited sessions, persistent memory, accountability check-ins, GPT-4o full |

> Note: $49 tier dropped for v1. Will revisit after product-market fit is confirmed.

**Requirements:**
- Stripe Checkout for subscription creation
- Stripe Webhook to update `is_paid` flag in Supabase
- Subscription management page (cancel, upgrade)
- Graceful paywall — show value before asking to pay

**Referral Program:**
- Referrer gets: 7 days of Pro free when their friend signs up
- Referred friend gets: 7 days of Pro free on signup
- Referral tracked via unique referral link per user

### 6.6 Module 6 — User Dashboard
- Conversation history list
- Resume/continue past conversations (paid only)
- Current plan display + upgrade CTA
- Account settings (name, email, password)

### 6.7 Module 7 — Landing Page
- Clear hero: what Dayryz does and who it's for
- Social proof section (testimonials — placeholder for MVP)
- Pricing table (2 tiers: Free + Pro)
- FAQ section
- CTA: "Start for free"
- SEO optimized (meta tags, OG image)

### 6.8 Module 8 — Polish & Launch
- Error handling (API failures, rate limits)
- Loading states throughout
- Mobile responsive
- Basic analytics (page views, signups, conversions)
- Production environment setup

---

## 7. Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| AI | OpenAI GPT-4o (paid) / GPT-4o mini (free) |
| Database + Auth | Supabase (PostgreSQL) |
| Payments | Stripe |
| Hosting | Vercel |
| Version control | GitHub |

---

## 8. User Stories

### Authentication
- As a visitor, I can sign up with email and password
- As a user, I can log in and my session persists
- As a user, I can reset my password via email

### Onboarding
- As any user (free or paid), I complete a structured profile before my first chat
- As a free user, my profile is used in this session but not saved after
- As a paid user, my profile is saved and loaded every time I return

### Chatbot
- As a free user, I can have up to 5 sessions per month
- As a user, I can choose which type of help I want (career change / startup / life redesign)
- As a paid user, my AI coach remembers everything from past sessions
- As a paid user, I receive weekly accountability check-ins

### Payments
- As a free user, I see a clear upgrade prompt when I hit my limit or when memory would help
- As a user, I can subscribe to Pro ($19/mo) via Stripe Checkout
- As a paid user, I can manage or cancel my subscription
- As a user, my tier updates immediately after payment

### Landing Page
- As a visitor, I understand what Dayryz does within 5 seconds
- As a visitor, I can see pricing before signing up
- As a visitor, I can start for free with no credit card required

---

## 9. Out of Scope (v1)

- $49 tier (revisit after PMF)
- Mobile app (iOS/Android)
- WhatsApp integration (planned for v2)
- Human coach marketplace
- Team/enterprise plans
- Social features (sharing, community)
- Multi-language support

---

## 10. Design Principles

1. **Hope-first** — every touchpoint should feel like a new beginning, not a problem to fix
2. **Warm not clinical** — conversational, human tone throughout
3. **Action-oriented** — always end with something the user can do next
4. **Low friction** — get users to their first valuable moment as fast as possible

---

## 11. Launch Plan

| Phase | Timeline | Goal |
|-------|----------|------|
| Build MVP | Weeks 1–3 | Working product with all 8 modules |
| Soft launch | Week 4 | 50 free users, gather feedback |
| Product Hunt | Week 6 | Public launch, 500+ signups |
| Content marketing | Month 2+ | TikTok/Reels, SEO blog |
| Paid acquisition | Month 4+ | Once conversion rates confirmed |

---

## 12. Open Questions

- [ ] Will Ruizhi appear on camera for marketing content, or go fully faceless?
- [ ] Should free tier reset monthly or be a lifetime limit? *(currently: 5/month)*
- [ ] What's the system prompt / persona name for the AI coach?
- [ ] Do we want a waitlist before launch or open signup?

---

*This document is a living reference. Update as decisions are made.*
