# WouldYouPay.io — Implementation Plan

> From landing page to live platform: everything required to reach MVP.

**Document Status:** Planning  
**Created:** 2026-01-30  
**Target:** Minimum Viable Product (MVP)

---

## Executive Summary

Transform WouldYouPay.io from a static collection of landing pages into a self-service platform where builders can:

1. Sign up and create an account
2. Register and describe their ideas
3. Get a live landing page instantly
4. Collect email signups from interested visitors
5. View analytics on their idea's traction
6. (Optionally) Pay for premium features

---

## Epic Overview

| # | Epic | Priority | Complexity | Dependencies |
|---|------|----------|------------|--------------|
| 1 | Authentication & User Management | P0 | Medium | None |
| 2 | Idea Creation & Management | P0 | Medium | Epic 1 |
| 3 | Dynamic Landing Page Generation | P0 | High | Epic 2 |
| 4 | Visitor Signup Capture | P0 | Medium | Epic 3 |
| 5 | Builder Dashboard & Analytics | P1 | Medium | Epics 2, 4 |
| 6 | Payments & Subscriptions | P1 | High | Epics 1, 5 |
| 7 | Custom Domains | P2 | High | Epic 3 |
| 8 | Infrastructure & DevOps | P0 | Medium | None |
| 9 | Security & Compliance | P0 | High | All |
| 10 | Legal & Terms | P0 | Low | None |

---

## Epic 1: Authentication & User Management

### Goal
Allow builders to create accounts, log in, and manage their profile.

### Stories

#### 1.1 User Registration
**As a** builder  
**I want to** create an account  
**So that** I can create and manage my ideas

**Tasks:**
- [ ] Design registration form (email, password, name)
- [ ] Implement email/password registration with Supabase Auth
- [ ] Add email verification flow
- [ ] Create welcome email template
- [ ] Add client-side validation
- [ ] Add server-side validation
- [ ] Handle duplicate email edge case
- [ ] Rate limit registration attempts

**Acceptance Criteria:**
- User can register with email and password
- Password meets minimum requirements (8+ chars, mixed case, number)
- Verification email sent within 30 seconds
- User redirected to dashboard after verification

#### 1.2 User Login
**As a** registered builder  
**I want to** log into my account  
**So that** I can access my ideas and dashboard

**Tasks:**
- [ ] Design login form
- [ ] Implement login with Supabase Auth
- [ ] Add "Remember me" functionality
- [ ] Implement session management
- [ ] Add login attempt rate limiting
- [ ] Log failed login attempts (security audit)
- [ ] Handle account lockout after N failed attempts

#### 1.3 Password Reset
**As a** builder who forgot my password  
**I want to** reset it via email  
**So that** I can regain access to my account

**Tasks:**
- [ ] Design password reset request form
- [ ] Design password reset form (new password entry)
- [ ] Implement reset token generation
- [ ] Create password reset email template
- [ ] Set token expiry (1 hour recommended)
- [ ] Invalidate token after use
- [ ] Rate limit reset requests per email

#### 1.4 OAuth Login (Optional for MVP)
**As a** builder  
**I want to** log in with Google/GitHub  
**So that** I don't need another password

**Tasks:**
- [ ] Configure Google OAuth in Supabase
- [ ] Configure GitHub OAuth in Supabase
- [ ] Add OAuth buttons to login/register forms
- [ ] Handle account linking (OAuth + existing email)
- [ ] Handle OAuth profile data (name, avatar)

#### 1.5 User Profile Management
**As a** logged-in builder  
**I want to** update my profile  
**So that** my information is accurate

**Tasks:**
- [ ] Design profile settings page
- [ ] Implement name update
- [ ] Implement email change (with re-verification)
- [ ] Implement password change
- [ ] Add avatar upload (optional)
- [ ] Implement account deletion (GDPR requirement)

### Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth Provider | Supabase Auth | Already using Supabase, built-in, secure |
| Session Storage | HTTP-only cookies | XSS protection |
| Password Hashing | bcrypt (via Supabase) | Industry standard |
| MFA | Deferred post-MVP | Complexity vs. user friction |

### Security Considerations

- [ ] Use HTTP-only, Secure, SameSite cookies
- [ ] Implement CSRF protection
- [ ] Rate limit all auth endpoints
- [ ] Log all auth events for audit
- [ ] Never expose user IDs in URLs (use UUIDs)
- [ ] Sanitize all user inputs
- [ ] Set secure password requirements

---

## Epic 2: Idea Creation & Management

### Goal
Allow builders to create, edit, and manage their ideas.

### Stories

#### 2.1 Create New Idea
**As a** logged-in builder  
**I want to** create a new idea  
**So that** I can test if people would pay for it

**Tasks:**
- [ ] Design idea creation form (multi-step wizard recommended)
- [ ] Define idea data model:
  ```
  Idea {
    id: UUID
    user_id: UUID (FK)
    slug: string (unique, URL-safe)
    title: string (max 60 chars)
    tagline: string (max 120 chars)
    problem: text (what problem does it solve)
    solution: text (how does it solve it)
    audience: string (who is it for)
    price_hint: string (optional - "Free", "$10/mo", "$99 one-time")
    status: enum (draft, live, paused, archived)
    created_at: timestamp
    updated_at: timestamp
  }
  ```
- [ ] Implement slug generation (from title, ensure unique)
- [ ] Implement slug validation (reserved words, profanity filter)
- [ ] Add character limits with live counters
- [ ] Save as draft functionality
- [ ] Preview before publish

**Acceptance Criteria:**
- User can create idea with required fields
- Slug is auto-generated and editable
- Draft can be saved and resumed
- Preview shows exactly what visitors will see
- Publish makes page live immediately

#### 2.2 Edit Existing Idea
**As a** builder  
**I want to** edit my idea after publishing  
**So that** I can improve the messaging

**Tasks:**
- [ ] Design edit form (pre-populated)
- [ ] Implement update endpoint
- [ ] Handle slug change (redirect old slug?)
- [ ] Add "last edited" timestamp
- [ ] Version history (optional for MVP)

#### 2.3 View My Ideas
**As a** builder  
**I want to** see all my ideas in one place  
**So that** I can manage them

**Tasks:**
- [ ] Design ideas list view
- [ ] Show idea status (draft/live/paused)
- [ ] Show key metrics (signups, views) per idea
- [ ] Add sorting/filtering
- [ ] Quick actions (edit, pause, delete, view page)

#### 2.4 Pause/Unpause Idea
**As a** builder  
**I want to** temporarily hide my landing page  
**So that** I can stop collecting signups without deleting

**Tasks:**
- [ ] Add pause/unpause toggle
- [ ] Paused pages show "Coming Soon" or 404
- [ ] Preserve all data when paused

#### 2.5 Delete Idea
**As a** builder  
**I want to** permanently delete an idea  
**So that** I can remove it completely

**Tasks:**
- [ ] Add delete confirmation modal
- [ ] Implement soft delete (keep data 30 days)
- [ ] Free up slug after deletion
- [ ] Handle associated signups (keep anonymized or delete?)
- [ ] GDPR consideration: what happens to visitor emails?

### Data Model

```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(60) UNIQUE NOT NULL,
  title VARCHAR(60) NOT NULL,
  tagline VARCHAR(120),
  problem TEXT,
  solution TEXT,
  audience VARCHAR(100),
  price_hint VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_slug ON ideas(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_ideas_status ON ideas(status);
```

### Business Rules

- Free tier: Maximum 2 active (non-draft) ideas
- Pro tier: Unlimited ideas
- Slug must be 3-60 characters, alphanumeric + hyphens
- Reserved slugs: www, api, app, admin, dashboard, login, signup, etc.

---

## Epic 3: Dynamic Landing Page Generation

### Goal
Automatically generate and serve landing pages for each idea.

### Stories

#### 3.1 Landing Page Template System
**As the** platform  
**I want to** generate landing pages from idea data  
**So that** builders get a page without coding

**Tasks:**
- [ ] Design landing page template (follows brand guide)
- [ ] Implement dynamic routing: `[slug].wouldyoupay.io` or `/idea/[slug]`
- [ ] Fetch idea data server-side (SSG or SSR)
- [ ] Handle 404 for non-existent/paused ideas
- [ ] Add Open Graph meta tags (dynamic per idea)
- [ ] Add Twitter Card meta tags
- [ ] Optimize for Core Web Vitals

**Template Sections:**
1. Hero: Title + Tagline + CTA
2. Problem: What pain does this solve?
3. Solution: How does it solve it?
4. Audience: Who is this for?
5. Signup Form: Email capture
6. Footer: WouldYouPay branding

#### 3.2 Subdomain Routing
**As a** visitor  
**I want to** access ideas at `[slug].wouldyoupay.io`  
**So that** each idea has its own URL

**Tasks:**
- [ ] Configure wildcard DNS: `*.wouldyoupay.io → Vercel`
- [ ] Implement middleware to extract subdomain
- [ ] Route subdomain to correct idea
- [ ] Handle www and apex domain specially
- [ ] Handle non-existent subdomains (404 or redirect to main site)

**Technical Approach:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const subdomain = hostname?.split('.')[0]
  
  if (subdomain && subdomain !== 'www' && subdomain !== 'wouldyoupay') {
    // Rewrite to /idea/[slug]
    return NextResponse.rewrite(new URL(`/idea/${subdomain}`, request.url))
  }
}
```

#### 3.3 Landing Page Customization (P2 - Post MVP)
**As a** Pro builder  
**I want to** customize my landing page  
**So that** it matches my brand

**Tasks:**
- [ ] Allow custom accent color
- [ ] Allow logo upload
- [ ] Allow custom CTA text
- [ ] Allow custom success message
- [ ] Theme presets (light/dark/custom)

### SEO Considerations

- [ ] Dynamic `<title>` per idea
- [ ] Dynamic `<meta description>` per idea
- [ ] Canonical URLs
- [ ] robots.txt (allow idea pages, disallow drafts)
- [ ] Sitemap generation for live ideas
- [ ] Structured data (JSON-LD for SoftwareApplication or Product)

---

## Epic 4: Visitor Signup Capture

### Goal
Capture and store email signups from visitors interested in ideas.

### Stories

#### 4.1 Email Signup Form
**As a** visitor  
**I want to** sign up for an idea  
**So that** I can be notified when it launches

**Tasks:**
- [ ] Design signup form (email input + submit button)
- [ ] Client-side email validation
- [ ] Server-side email validation
- [ ] Honeypot field for bot detection
- [ ] Rate limiting (max 5 signups per IP per hour)
- [ ] Success state design
- [ ] Error state design

#### 4.2 Signup Data Storage
**As the** platform  
**I want to** store signups securely  
**So that** builders can contact interested people

**Tasks:**
- [ ] Define signup data model:
  ```
  Signup {
    id: UUID
    idea_id: UUID (FK)
    email: string (encrypted at rest)
    source: string (direct, twitter, google, etc.)
    ip_hash: string (hashed, not raw IP)
    user_agent: string
    created_at: timestamp
  }
  ```
- [ ] Implement signup API endpoint
- [ ] Encrypt email addresses at rest
- [ ] Prevent duplicate signups (same email + idea)
- [ ] Track signup source (UTM params or referrer)

#### 4.3 Signup Confirmation Email
**As a** visitor who signed up  
**I want to** receive a confirmation  
**So that** I know my signup was received

**Tasks:**
- [ ] Design confirmation email template
- [ ] Include idea name and description
- [ ] Include unsubscribe link (GDPR/CAN-SPAM requirement)
- [ ] Send via transactional email service (Resend, SendGrid, Postmark)
- [ ] Handle email delivery failures

#### 4.4 Double Opt-in (Recommended)
**As the** platform  
**I want to** verify email addresses  
**So that** we maintain list quality and comply with regulations

**Tasks:**
- [ ] Send verification email with unique link
- [ ] Mark signup as "pending" until verified
- [ ] Expire verification links after 48 hours
- [ ] Only show verified signups to builders
- [ ] Re-send verification option

### Data Model

```sql
CREATE TABLE signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  email_encrypted BYTEA NOT NULL,
  email_hash VARCHAR(64) NOT NULL, -- For duplicate detection
  verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(64),
  verification_expires_at TIMESTAMPTZ,
  source VARCHAR(50),
  ip_hash VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_signups_idea_id ON signups(idea_id);
CREATE UNIQUE INDEX idx_signups_unique ON signups(idea_id, email_hash) 
  WHERE unsubscribed_at IS NULL;
```

### Privacy Considerations

- [ ] Encrypt emails at rest (application-level encryption)
- [ ] Hash IPs (never store raw)
- [ ] Provide unsubscribe mechanism
- [ ] Honor unsubscribe requests immediately
- [ ] Data retention policy (delete unverified after 30 days)
- [ ] GDPR: Allow data export and deletion requests

---

## Epic 5: Builder Dashboard & Analytics

### Goal
Give builders visibility into their ideas' performance.

### Stories

#### 5.1 Dashboard Home
**As a** logged-in builder  
**I want to** see an overview of my ideas' performance  
**So that** I can make decisions

**Tasks:**
- [ ] Design dashboard layout
- [ ] Show total signups across all ideas
- [ ] Show total page views (if tracked)
- [ ] Show conversion rate (signups / views)
- [ ] Quick links to each idea
- [ ] Highlight best-performing idea

#### 5.2 Idea Analytics
**As a** builder  
**I want to** see detailed analytics for each idea  
**So that** I can understand what's working

**Tasks:**
- [ ] Design idea detail view
- [ ] Show signup count (verified vs. total)
- [ ] Show page views (requires tracking - see 5.3)
- [ ] Show conversion rate
- [ ] Show signups over time (chart)
- [ ] Show traffic sources
- [ ] Show geographic distribution (optional)

#### 5.3 Page View Tracking
**As the** platform  
**I want to** track landing page views  
**So that** builders can see conversion rates

**Tasks:**
- [ ] Implement privacy-respecting analytics
- [ ] Options: Plausible, Fathom, Umami, or custom
- [ ] Track: page views, unique visitors, referrer, country
- [ ] Do NOT track: IP addresses, personal data
- [ ] Aggregate data only (no individual visitor tracking)
- [ ] Display in dashboard

**Technical Decision:**
Self-hosted Umami or Plausible recommended for privacy.

#### 5.4 Signup List
**As a** builder  
**I want to** see and export my signup list  
**So that** I can contact interested people

**Tasks:**
- [ ] Design signup list view
- [ ] Show email, date, source, verification status
- [ ] Pagination for large lists
- [ ] Search/filter functionality
- [ ] Export to CSV
- [ ] Export to common email tools (Mailchimp, ConvertKit)

**Security:**
- [ ] Rate limit exports
- [ ] Log all export events
- [ ] Only show verified emails (or flag unverified)

#### 5.5 Email Notifications for Builders
**As a** builder  
**I want to** be notified when I get signups  
**So that** I can see traction without checking dashboard

**Tasks:**
- [ ] Daily digest email (if signups > 0)
- [ ] Milestone notifications (10, 50, 100 signups)
- [ ] Notification preferences in settings
- [ ] Unsubscribe from notifications

---

## Epic 6: Payments & Subscriptions

### Goal
Monetize the platform with subscription tiers.

### Stories

#### 6.1 Define Pricing Tiers

**Free Tier:**
- 2 active ideas
- Basic analytics (signup count only)
- WouldYouPay branding on pages
- Community support

**Pro Tier (£9/month or £90/year):**
- Unlimited ideas
- Full analytics (views, conversion, sources)
- Remove WouldYouPay branding
- Custom CTA text
- Priority support
- Export signups

**Future Tiers (Post-MVP):**
- Team tier: Multiple users, shared ideas
- Agency tier: White-label, client management

#### 6.2 Stripe Integration
**As the** platform  
**I want to** accept payments via Stripe  
**So that** users can upgrade to Pro

**Tasks:**
- [ ] Create Stripe account and products
- [ ] Configure subscription plans (monthly + annual)
- [ ] Implement Stripe Checkout for upgrades
- [ ] Handle Stripe webhooks:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- [ ] Store subscription status in database
- [ ] Sync subscription state on login

#### 6.3 Upgrade Flow
**As a** Free user  
**I want to** upgrade to Pro  
**So that** I can access premium features

**Tasks:**
- [ ] Design upgrade prompts (at limit, in settings)
- [ ] Design pricing page
- [ ] Implement checkout redirect to Stripe
- [ ] Handle successful upgrade (unlock features immediately)
- [ ] Send upgrade confirmation email

#### 6.4 Subscription Management
**As a** Pro user  
**I want to** manage my subscription  
**So that** I can update payment or cancel

**Tasks:**
- [ ] Implement Stripe Customer Portal link
- [ ] Allow plan changes (monthly ↔ annual)
- [ ] Handle cancellation
- [ ] Handle reactivation
- [ ] Grace period for failed payments (7 days)
- [ ] Downgrade logic (what happens to extra ideas?)

#### 6.5 Enforce Tier Limits
**As the** platform  
**I want to** enforce feature limits by tier  
**So that** Free users upgrade

**Tasks:**
- [ ] Check tier before creating new idea
- [ ] Show upgrade prompt when limit reached
- [ ] Gate analytics features by tier
- [ ] Gate export features by tier
- [ ] Gate branding removal by tier

### Data Model

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  tier VARCHAR(20) DEFAULT 'free',
  status VARCHAR(20) DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
```

### Business Rules

- Downgrade: Keep oldest 2 ideas active, pause the rest
- Failed payment: 7-day grace period, then downgrade
- Refunds: Handle via Stripe dashboard, manual process for MVP
- Trials: Consider 14-day Pro trial for new users (post-MVP)

---

## Epic 7: Custom Domains (P2 - Post MVP)

### Goal
Allow Pro users to use their own domain for landing pages.

### Stories

#### 7.1 Add Custom Domain
**As a** Pro builder  
**I want to** use my own domain  
**So that** my landing page looks more professional

**Tasks:**
- [ ] Design domain settings UI
- [ ] Validate domain format
- [ ] Generate DNS verification record
- [ ] Verify domain ownership (DNS TXT record)
- [ ] Configure SSL certificate (via Vercel or Let's Encrypt)
- [ ] Route traffic from custom domain to idea

**Technical Approach:**
Use Vercel's domain API or Cloudflare for custom domains.

#### 7.2 Domain Verification
**Tasks:**
- [ ] Display DNS records user needs to add
- [ ] Check verification status
- [ ] Auto-retry verification
- [ ] Notify user when verified
- [ ] Handle verification failures

#### 7.3 SSL Provisioning
**Tasks:**
- [ ] Auto-provision SSL via Vercel/Cloudflare
- [ ] Handle SSL errors gracefully
- [ ] Renew certificates automatically

---

## Epic 8: Infrastructure & DevOps

### Goal
Ensure the platform is reliable, scalable, and maintainable.

### Stories

#### 8.1 Database Setup
**Tasks:**
- [ ] Configure Supabase project (or PlanetScale/Neon)
- [ ] Set up connection pooling
- [ ] Configure database backups
- [ ] Set up read replicas (if needed for scale)
- [ ] Implement database migrations system

#### 8.2 Hosting & Deployment
**Tasks:**
- [ ] Configure Vercel project
- [ ] Set up preview deployments for PRs
- [ ] Configure production environment variables
- [ ] Set up staging environment
- [ ] Configure custom domain (wouldyoupay.io)
- [ ] Configure wildcard subdomain (*.wouldyoupay.io)

#### 8.3 Email Delivery
**Tasks:**
- [ ] Choose transactional email provider (Resend recommended)
- [ ] Configure SPF, DKIM, DMARC for deliverability
- [ ] Design email templates (verification, welcome, notifications)
- [ ] Monitor delivery rates and bounces
- [ ] Handle unsubscribes

#### 8.4 File Storage (if needed)
**Tasks:**
- [ ] Configure Supabase Storage or S3
- [ ] For: user avatars, idea images (if we add them)
- [ ] Set up CDN for static assets

#### 8.5 Monitoring & Alerting
**Tasks:**
- [ ] Set up error tracking (Sentry)
- [ ] Set up uptime monitoring (BetterUptime, Checkly)
- [ ] Configure alerts for errors and downtime
- [ ] Set up performance monitoring
- [ ] Log aggregation (if needed)

#### 8.6 CI/CD Pipeline
**Tasks:**
- [ ] Lint on PR
- [ ] Type check on PR
- [ ] Run tests on PR
- [ ] Preview deploy on PR
- [ ] Auto-deploy main to production
- [ ] Database migration on deploy

---

## Epic 9: Security & Compliance

### Goal
Protect user data and prevent abuse.

### Stories

#### 9.1 Authentication Security
**Tasks:**
- [ ] Secure password requirements
- [ ] HTTP-only, Secure, SameSite cookies
- [ ] CSRF protection
- [ ] Session timeout (30 days, refresh on activity)
- [ ] Invalidate sessions on password change
- [ ] Rate limit login attempts
- [ ] Account lockout after failed attempts

#### 9.2 API Security
**Tasks:**
- [ ] Authenticate all API routes
- [ ] Authorize resource access (user can only access own data)
- [ ] Input validation on all endpoints
- [ ] Rate limiting per user and per IP
- [ ] CORS configuration
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize outputs)

#### 9.3 Data Protection
**Tasks:**
- [ ] Encrypt sensitive data at rest (emails)
- [ ] Encrypt data in transit (HTTPS everywhere)
- [ ] Secure environment variables
- [ ] Database access controls
- [ ] Audit logging for sensitive operations
- [ ] Regular security reviews

#### 9.4 Abuse Prevention
**Tasks:**
- [ ] Signup honeypot for bots
- [ ] CAPTCHA for high-risk actions (optional)
- [ ] Profanity filter for slugs and content
- [ ] Report mechanism for abusive content
- [ ] Admin tools to suspend accounts/ideas

#### 9.5 GDPR Compliance
**Tasks:**
- [ ] Cookie consent banner
- [ ] Privacy policy
- [ ] Data processing agreement (for builders collecting emails)
- [ ] Right to access (data export)
- [ ] Right to deletion (account + data deletion)
- [ ] Data retention policy
- [ ] Breach notification process

#### 9.6 Penetration Testing (Pre-Launch)
**Tasks:**
- [ ] Automated security scanning
- [ ] Manual penetration test (or self-audit)
- [ ] Fix identified vulnerabilities
- [ ] Retest after fixes

---

## Epic 10: Legal & Terms

### Goal
Protect the business and users legally.

### Stories

#### 10.1 Terms of Service
**Tasks:**
- [ ] Draft Terms of Service
- [ ] Cover: acceptable use, prohibited content, termination rights
- [ ] Cover: intellectual property (users own their ideas)
- [ ] Cover: limitation of liability
- [ ] Legal review (recommended)
- [ ] Display on signup and footer

#### 10.2 Privacy Policy
**Tasks:**
- [ ] Draft Privacy Policy
- [ ] Cover: what data we collect
- [ ] Cover: how we use data
- [ ] Cover: data sharing (Stripe, email providers)
- [ ] Cover: data retention
- [ ] Cover: user rights (access, deletion)
- [ ] Cover: cookies and tracking
- [ ] GDPR-compliant language
- [ ] Legal review (recommended)

#### 10.3 Cookie Policy
**Tasks:**
- [ ] Document cookies used
- [ ] Essential cookies (auth)
- [ ] Analytics cookies (if any)
- [ ] Cookie consent mechanism

#### 10.4 Data Processing Agreement
**Tasks:**
- [ ] For builders collecting visitor emails
- [ ] Define builder as data controller, WYP as processor
- [ ] Cover: data handling, security, deletion

---

## MVP Scope Definition

### In Scope (MVP)

| Feature | Epic |
|---------|------|
| Email/password registration and login | 1 |
| Password reset | 1 |
| User profile (name, email, password) | 1 |
| Create/edit/delete ideas | 2 |
| Idea listing page | 2 |
| Dynamic landing page generation | 3 |
| Subdomain routing (slug.wouldyoupay.io) | 3 |
| Email signup capture | 4 |
| Double opt-in verification | 4 |
| Basic dashboard (signup counts) | 5 |
| Signup list view and CSV export | 5 |
| Free tier (2 ideas) | 6 |
| Pro tier via Stripe | 6 |
| Database (Supabase) | 8 |
| Hosting (Vercel) | 8 |
| Transactional email (Resend) | 8 |
| Error tracking (Sentry) | 8 |
| Core security measures | 9 |
| Terms of Service | 10 |
| Privacy Policy | 10 |

### Out of Scope (Post-MVP)

| Feature | Epic |
|---------|------|
| OAuth login (Google/GitHub) | 1 |
| Landing page customization | 3 |
| Custom domains | 7 |
| Advanced analytics (views, sources, charts) | 5 |
| Email integrations (Mailchimp, ConvertKit) | 5 |
| Team accounts | 6 |
| A/B testing | Future |
| API access | Future |
| Mobile app | Future |

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Stripe |
| Email | Resend |
| Hosting | Vercel |
| Analytics | Umami (self-hosted) or Plausible |
| Error Tracking | Sentry |
| DNS | Cloudflare |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Cloudflare                          │
│                    (DNS, CDN, DDoS Protection)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          Vercel                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Next.js App   │  │    Middleware   │                  │
│  │  (App Router)   │  │ (Subdomain →    │                  │
│  │                 │  │  /idea/[slug])  │                  │
│  └────────┬────────┘  └─────────────────┘                  │
│           │                                                 │
│  ┌────────▼────────┐  ┌─────────────────┐                  │
│  │   API Routes    │  │  Static Assets  │                  │
│  │  /api/*         │  │   (CDN cached)  │                  │
│  └────────┬────────┘  └─────────────────┘                  │
└───────────┼─────────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────┐  ┌───────────────────────┐
│       Supabase        │  │        Stripe         │
│  ┌─────────────────┐  │  │  (Payments, Webhooks) │
│  │   PostgreSQL    │  │  └───────────────────────┘
│  │   (Database)    │  │
│  └─────────────────┘  │  ┌───────────────────────┐
│  ┌─────────────────┐  │  │        Resend         │
│  │   Supabase      │  │  │ (Transactional Email) │
│  │   Auth          │  │  └───────────────────────┘
│  └─────────────────┘  │
│  ┌─────────────────┐  │  ┌───────────────────────┐
│  │   Storage       │  │  │        Sentry         │
│  │   (if needed)   │  │  │   (Error Tracking)    │
│  └─────────────────┘  │  └───────────────────────┘
└───────────────────────┘
```

---

## Estimated Timeline

### Phase 1: Foundation (2-3 weeks)
- Epic 1: Authentication (1 week)
- Epic 8: Infrastructure basics (0.5 week)
- Epic 10: Legal documents (0.5 week)
- Epic 9: Core security (ongoing)

### Phase 2: Core Features (3-4 weeks)
- Epic 2: Idea management (1.5 weeks)
- Epic 3: Landing page generation (1.5 weeks)
- Epic 4: Signup capture (1 week)

### Phase 3: Monetization (2 weeks)
- Epic 5: Dashboard basics (1 week)
- Epic 6: Stripe integration (1 week)

### Phase 4: Polish & Launch (1-2 weeks)
- Testing and bug fixes
- Security review
- Performance optimization
- Soft launch

**Total estimated: 8-11 weeks**

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Subdomain routing complexity | Medium | High | Spike early, test thoroughly |
| Stripe integration issues | Low | Medium | Use Stripe Checkout (simplest path) |
| Email deliverability | Medium | Medium | Use reputable provider, configure DNS properly |
| Abuse/spam | High | Medium | Rate limiting, honeypots, manual review |
| Legal exposure | Low | High | Proper terms, privacy policy, legal review |
| Scope creep | High | Medium | Strict MVP definition, defer non-essentials |

---

## Open Questions

1. **Branding on free pages:** How prominent should WouldYouPay branding be?
2. **Signup data ownership:** Who owns the email list — builder or platform?
3. **Idea approval:** Should ideas be reviewed before going live? (Abuse prevention vs. friction)
4. **Pricing:** Is £9/month right? Should we offer annual discount?
5. **Trials:** Should new users get a free Pro trial?

---

## Next Steps

1. Review and approve this plan
2. Set up project in Kanban
3. Create epics and stories
4. Prioritize and estimate
5. Begin Phase 1 development

---

*Document created: 2026-01-30*  
*Version: 1.0*
