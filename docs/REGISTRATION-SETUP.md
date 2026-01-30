# User Registration - Setup Guide

**Status:** ✅ Code Complete | ⚠️ Supabase Configuration Needed  
**Epic:** 1.1 User Registration  
**Deployed:** Commit 0785bfa

---

## What Was Implemented

### 🎨 User-Facing Features

1. **Registration Page** (`/register`)
   - Clean form with name, email, password, confirm password
   - Real-time client-side validation
   - Password strength requirements displayed
   - Success screen after registration
   - Links to login page

2. **Email Verification Flow**
   - Verification email sent automatically on registration
   - Callback handler processes verification links
   - Redirects to dashboard after verification

3. **Protected Dashboard** (`/dashboard`)
   - Shows user info and verification status
   - Redirects to login if not authenticated
   - Placeholder for future features

### 🔧 Technical Implementation

1. **Supabase Auth Integration**
   - `@supabase/supabase-js` and `@supabase/ssr` installed
   - Browser client for client-side operations
   - Server client for API routes and Server Components
   - Middleware for session management

2. **API Routes**
   - `/api/auth/register` - Registration endpoint with validation
   - `/auth/callback` - Email verification handler

3. **Validation**
   - **Password:** 8+ chars, uppercase, lowercase, number
   - **Email:** Standard email regex
   - **Name:** Minimum 2 characters
   - Both client-side (instant feedback) and server-side (security)

4. **Security**
   - Rate limiting: 5 attempts/hour per IP
   - Duplicate email detection
   - Secure password storage via Supabase Auth
   - HTTPS-only cookies

---

## 🚨 Captain Action Required

### Step 1: Configure Supabase Email Templates

1. **Login to Supabase:**
   - Go to: https://supabase.com/dashboard
   - Select your **wouldyoupay** project

2. **Configure Email Templates:**
   - Navigate to: **Authentication** → **Email Templates**
   
   **Templates to configure:**
   
   #### A. Confirm Signup (Required)
   - This is sent when users register
   - Default template is fine, but customize if desired
   - Example subject: "Verify your WouldYouPay account"
   - Body should include: `{{ .ConfirmationURL }}`
   
   #### B. Reset Password (Future - Optional Now)
   - Will be needed for password reset feature
   - Can configure now or later
   
   #### C. Magic Link (Optional)
   - Only needed if implementing passwordless login
   - Can skip for now

3. **Set Site URL:**
   - Go to: **Settings** → **URL Configuration**
   - Set **Site URL** to: `https://wouldyoupay.io`
   
4. **Add Redirect URLs:**
   - In the same **URL Configuration** section
   - Add to **Redirect URLs**:
     ```
     https://wouldyoupay.io/auth/callback
     https://wouldyoupay.io/dashboard
     ```
   
5. **Enable Email Confirmations:**
   - Go to: **Authentication** → **Providers** → **Email**
   - Ensure **Confirm email** is enabled
   - Recommended: Enable **Secure email change** as well

### Step 2: Test Registration Flow

#### Local Testing (Recommended First)

```bash
# Start dev server
cd ~/projects/wouldyoupay
npm run dev

# Visit registration page
open http://localhost:3000/register
```

**Test Cases:**

1. **Valid Registration:**
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "Test123456"
   - Confirm: "Test123456"
   - Expected: Success screen, check email for verification

2. **Password Validation:**
   - Try: "test" → Should fail (too short)
   - Try: "testtest" → Should fail (no uppercase)
   - Try: "Testtest" → Should fail (no number)
   - Try: "Test1234" → Should succeed

3. **Email Validation:**
   - Try: "not-an-email" → Should fail
   - Try: "test@example.com" → Should succeed

4. **Duplicate Email:**
   - Register same email twice
   - Expected: "An account with this email already exists"

5. **Rate Limiting:**
   - Register 6 times in a row
   - Expected: 6th attempt blocked with "Too many registration attempts"

#### Production Testing

```bash
# Visit live site
open https://wouldyoupay.io/register
```

Same test cases as above.

**Email Verification:**
1. Check your inbox for verification email from Supabase
2. Click verification link
3. Should redirect to `/dashboard`
4. Dashboard should show "Email Verified: ✅ Yes"

---

## 📁 Files Created

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── register/
│   │           └── route.ts          # Registration API endpoint
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts              # Email verification handler
│   ├── dashboard/
│   │   └── page.tsx                  # Protected dashboard
│   └── register/
│       └── page.tsx                  # Registration form
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client
│   └── validation.ts                 # Validation utilities
└── middleware.ts                     # Auth session middleware
```

---

## 🔒 Security Features

1. **Rate Limiting**
   - 5 registration attempts per hour per IP
   - Prevents spam and abuse
   - Currently in-memory (upgrade to Redis for multi-instance deployments)

2. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

3. **Email Verification**
   - Required before account is fully active
   - Prevents fake email registrations
   - Verification links expire (configurable in Supabase)

4. **Duplicate Prevention**
   - Cannot register same email twice
   - Handled by Supabase Auth

5. **Secure Sessions**
   - HTTP-only cookies
   - Secure flag in production
   - SameSite=Lax
   - Managed by middleware

---

## 🐛 Troubleshooting

### Issue: "Email not being sent"

**Check:**
1. Supabase email templates configured?
2. Site URL set correctly in Supabase?
3. Email provider not blocking Supabase emails (check spam folder)
4. Supabase project has email quotas remaining (free tier: 30k/month)

**Solution:**
- Go to Supabase dashboard → Project Settings → Usage
- Check email quota
- If exceeded, upgrade plan or wait for reset

### Issue: "Email verification link doesn't work"

**Check:**
1. Redirect URLs configured in Supabase?
2. Site URL matches production domain?
3. Middleware is running (check logs)

**Solution:**
- Ensure `https://wouldyoupay.io/auth/callback` is in Redirect URLs
- Regenerate verification email

### Issue: "Rate limit blocking legitimate users"

**Current Limit:** 5 attempts/hour per IP

**Solution:**
- Adjust limit in `/app/api/auth/register/route.ts`
- Look for `limit.count >= 5` and increase number
- Consider upgrading to Redis-based rate limiting for production

### Issue: "Dashboard shows 'Email Verified: ❌ No'"

**This is expected before clicking verification link**

**Solution:**
1. Check email inbox (and spam folder)
2. Click verification link in email
3. Will redirect to dashboard and show ✅

---

## 📋 Next Steps (Future Epics)

### Epic 1.2: User Login
- [ ] Design login form
- [ ] Implement login with Supabase Auth
- [ ] Add "Remember me" functionality
- [ ] Handle login failures

### Epic 1.3: Password Reset
- [ ] Design password reset request form
- [ ] Implement reset token generation
- [ ] Create password reset email template
- [ ] Build password reset form

### Epic 1.4: OAuth Login (Optional)
- [ ] Add Google OAuth
- [ ] Add GitHub OAuth
- [ ] Merge OAuth accounts with existing email accounts

---

## 🎯 Acceptance Criteria Status

| Criteria | Status | Notes |
|----------|--------|-------|
| User can register with email and password | ✅ | Form and API complete |
| Password meets requirements (8+ chars, mixed case, number) | ✅ | Client and server validation |
| Verification email sent within 30 seconds | ⚠️ | Depends on Supabase config |
| User redirected to dashboard after verification | ✅ | Callback route handles this |

**Overall Status:** ✅ Code Complete | ⚠️ Supabase Email Templates Needed

---

## 📞 Support

If you encounter issues:

1. Check Supabase dashboard logs: Authentication → Logs
2. Check browser console for errors
3. Check server logs in Vercel deployment
4. Review this guide's Troubleshooting section

---

*Last Updated: 2026-01-30*  
*Commit: 0785bfa*  
*Epic: 1.1 User Registration*
