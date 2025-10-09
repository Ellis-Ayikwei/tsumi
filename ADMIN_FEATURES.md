# Tsumi Admin Panel - Complete Feature List

## 🎯 Core Admin Functions

### 1. **Dashboard Overview** (`/admin`)
- [ ] Real-time platform statistics
  - Total users (customers + agents)
  - Active errands (ongoing, pending, completed today)
  - Revenue metrics (daily, weekly, monthly)
  - Escrow holdings (total locked amount)
  - Platform commission earned
- [ ] Quick action buttons
  - Approve pending KYC
  - Resolve urgent disputes
  - Release stuck escrow
- [ ] Activity feed
  - Recent errand completions
  - New user registrations
  - Agent applications
  - Dispute filings
- [ ] Charts & Analytics
  - Errand completion rate (line chart)
  - Revenue trends (bar chart)
  - Agent performance (leaderboard)
  - Geographic distribution (map)

---

### 2. **User Management** (`/admin/users`)
- [ ] User List View
  - Search by name, email, phone
  - Filter by: role (customer/agent), status (active/suspended/banned), verification status
  - Sort by: join date, total errands, trust score
  - Pagination (50 users per page)
- [ ] User Details Modal/Page
  - Personal info (name, email, phone, address)
  - Account status (active, suspended, banned)
  - Verification status (email verified, phone verified, ID verified)
  - Trust score & badges
  - Transaction history
  - Errand history (requested/completed)
  - Wallet balance
- [ ] User Actions
  - View full profile
  - Suspend account (with reason)
  - Ban account (with reason)
  - Unban/Reactivate account
  - Reset password
  - Adjust wallet balance (with audit log)
  - Send notification/message
  - Export user data (GDPR compliance)

---

### 3. **Agent Management** (`/admin/agents`)
- [ ] Agent List View
  - Search by name, ID, phone
  - Filter by: KYC status (pending/approved/rejected), badge level, rating, active/inactive
  - Sort by: earnings, completion rate, rating, join date
  - Quick stats: total agents, pending KYC, active today
- [ ] Agent Details Page (`/admin/agents/:id`)
  - Personal Information
    - Full name, phone, email, address
    - Ghana Card number, photo
    - Date of birth, gender
  - KYC Documents
    - Ghana Card front/back images
    - Selfie verification photo
    - Address proof document
    - Reference contact (if provided)
  - Performance Metrics
    - Total errands completed
    - Completion rate (%)
    - Average rating (stars)
    - Total earnings
    - Current balance
    - Response time (avg)
  - Trust Badges
    - Current badges (Verified ID, Reliable Runner, etc.)
    - Badge history (when earned)
    - Eligibility for new badges
  - Recent Activity
    - Last 10 errands completed
    - Recent ratings & reviews
    - Withdrawal history
- [ ] KYC Review Interface (`/admin/kyc/:id`)
  - Side-by-side document comparison
    - Ghana Card vs Selfie (face match check)
    - Document authenticity indicators
  - Manual verification checklist
    - [ ] ID document is clear and readable
    - [ ] Face matches selfie
    - [ ] ID not expired
    - [ ] Address is valid
    - [ ] Background check passed (if applicable)
  - Actions
    - ✅ Approve (grant "Verified ID" badge)
    - ❌ Reject (with reason: unclear photo, mismatch, expired, etc.)
    - 🔄 Request resubmission (with specific instructions)
  - Notes field (internal admin notes)
- [ ] Badge Management
  - Manually assign badges (for special cases)
  - Revoke badges (with reason)
  - Create custom badges
  - Set badge eligibility criteria
- [ ] Agent Actions
  - Approve/Reject KYC
  - Suspend agent (prevent job acceptance)
  - Ban agent permanently
  - Adjust earnings (refund/bonus)
  - Promote to "Pro Runner" (verified badge)
  - Send warning/notification
  - View GPS tracking history

---

### 4. **Errand Management** (`/admin/errands`)
- [ ] Errand List View
  - Search by ID, customer name, agent name, location
  - Filter by: status (pending/matched/in_progress/completed/cancelled/disputed), date range, amount range
  - Sort by: created date, amount, priority
  - Quick stats: total errands today, success rate, avg completion time
- [ ] Errand Details Page (`/admin/errands/:id`)
  - Errand Information
    - Errand ID, title, description
    - Type (pickup/delivery/shopping/custom)
    - Status with timeline
    - Created date, completion date
    - Estimated vs actual time
  - Parties Involved
    - Customer (name, phone, rating)
    - Agent (name, phone, rating)
    - Link to profiles
  - Location & Tracking
    - Pickup location (address + map)
    - Dropoff location (address + map)
    - GPS tracking history (if available)
    - Distance traveled
  - Financial Details
    - Errand fee (GHS)
    - Platform commission (%)
    - Agent earnings
    - Tip amount
    - Total paid by customer
  - Proof of Completion
    - Photos uploaded
    - OTP confirmation
    - Signature (if applicable)
    - Timestamp
  - Communication Log
    - In-app chat history
    - Call logs (if tracked)
- [ ] Errand Actions
  - View full details
  - Cancel errand (with refund)
  - Reassign to different agent
  - Override status (emergency)
  - Mark as priority
  - Add admin notes
  - Export errand data

---

### 5. **Escrow Management** (`/admin/escrow`)
- [ ] Escrow Dashboard
  - Total amount in escrow (GHS)
  - Pending releases (count)
  - Stuck/disputed funds
  - Daily inflow/outflow
- [ ] Transaction List
  - All escrow transactions
  - Filter by: type (deposit/hold/release/refund), status, date range, amount range
  - Search by: transaction ID, user, errand ID
- [ ] Transaction Details
  - Transaction ID, type, amount
  - From/To (customer/agent)
  - Related errand
  - Status (pending/completed/failed)
  - Created date, completed date
  - Reason (if failed)
- [ ] Escrow Actions
  - ✅ Release funds to agent (manual override)
  - ↩️ Refund to customer (with reason)
  - 🔒 Hold funds (dispute/investigation)
  - ⏸️ Pause auto-release
  - 📊 Generate reconciliation report
  - 🔍 Audit transaction history

---

### 6. **Dispute Management** (`/admin/disputes`)
- [ ] Dispute Queue
  - List all disputes
  - Filter by: status (open/investigating/resolved/closed), priority (low/medium/high/urgent), type
  - Sort by: date filed, amount, escalation level
  - Quick stats: open disputes, avg resolution time, customer satisfaction
- [ ] Dispute Details Page (`/admin/disputes/:id`)
  - Dispute Information
    - Dispute ID, title, category
    - Filed by (customer/agent)
    - Filed against (agent/customer)
    - Date filed, last updated
    - Priority level
    - Status
  - Related Errand
    - Link to errand details
    - Errand status at time of dispute
    - Amount in question
  - Evidence Submitted
    - Customer's claim (description)
    - Agent's response (description)
    - Photos/screenshots
    - Chat logs
    - GPS tracking data
  - Timeline
    - All actions taken
    - Status changes
    - Admin notes
    - Messages sent
  - Admin Investigation Tools
    - View full errand history
    - Review chat logs
    - Check GPS location history
    - Review both parties' history (past disputes)
    - Internal notes (visible to admins only)
- [ ] Dispute Resolution Actions
  - ✅ Resolve in favor of customer (full refund)
  - ✅ Resolve in favor of agent (release payment)
  - ⚖️ Partial resolution (split amount)
  - 🔄 Request more evidence
  - ⏰ Escalate to senior admin
  - 📞 Schedule mediation call
  - ✍️ Send message to parties
  - 🔨 Take action (suspend user, ban agent, etc.)
  - 📋 Close dispute (with resolution notes)

---

### 7. **Platform Settings** (`/admin/settings`)
- [ ] General Settings
  - Platform name & branding
  - Default currency (GHS)
  - Default language (English/Twi)
  - Timezone (Ghana)
  - Contact information
- [ ] Commission & Fees
  - Platform commission % (default: 15%)
  - Tier-based commission (1-10 errands: 15%, 11-50: 13%, etc.)
  - Minimum errand fee
  - Maximum errand fee
  - Service fee caps
  - Withdrawal fee (if any)
- [ ] Payment Settings
  - Enable/disable payment methods
    - MTN MoMo (enabled/disabled)
    - Vodafone Cash
    - AirtelTigo Money
    - Paystack (card payments)
  - Payment gateway API keys
  - Auto-release timing (e.g., 24h after completion)
  - Escrow hold period
- [ ] Trust & Safety Settings
  - KYC requirements (toggle mandatory fields)
  - Background check integration (enable/disable)
  - Trust score algorithm weights
  - Badge eligibility criteria
  - Review system settings (enable/disable)
  - Minimum rating for agents to continue
  - Auto-suspension thresholds
- [ ] Notification Settings
  - Email notifications (enable/disable by type)
  - SMS notifications
  - Push notifications
  - Admin alert thresholds
  - Notification templates
- [ ] Service Area Settings
  - Supported regions (Accra, Tema, Kumasi, etc.)
  - Geofence boundaries
  - Default map center & zoom
  - Distance calculation settings
- [ ] Feature Flags
  - Enable/disable features
    - Live tracking
    - In-app chat
    - Voice calls
    - Video proof
    - Tips
    - Scheduled errands
    - Recurring errands
    - Business accounts

---

### 8. **Reports & Analytics** (`/admin/reports`)
- [ ] Financial Reports
  - Revenue report (daily/weekly/monthly/yearly)
    - Total errand value
    - Platform commission earned
    - Breakdown by payment method
    - Payouts to agents
  - Escrow report
    - Total held in escrow
    - Average hold time
    - Release rate
    - Refund rate
  - Export to CSV/PDF
- [ ] Operational Reports
  - Errand statistics
    - Total errands (by status, type, date range)
    - Completion rate
    - Average completion time
    - Cancellation rate (with reasons)
  - User growth
    - New signups (customers/agents)
    - Active users (DAU/WAU/MAU)
    - Retention rate
    - Churn rate
  - Agent performance
    - Leaderboard (top 10/50/100)
    - Average rating
    - Earnings distribution
    - Active vs inactive agents
- [ ] Geographic Reports
  - Errands by location (heat map)
  - Agent distribution
  - Popular pickup/dropoff areas
  - Service gaps (underserved areas)
- [ ] Trust & Safety Reports
  - KYC approval rate
  - Dispute statistics
    - Total disputes
    - Resolution rate
    - Average resolution time
    - Outcomes (customer favor/agent favor/split)
  - Suspended/banned accounts
  - Fraud indicators
- [ ] Custom Reports
  - Date range selector
  - Filter by multiple criteria
  - Export options (CSV, Excel, PDF)
  - Schedule automated reports (daily/weekly/monthly)

---

### 9. **Notifications & Alerts** (`/admin/notifications`)
- [ ] Send Mass Notifications
  - Target audience selector
    - All users
    - Customers only
    - Agents only
    - Specific user segment
  - Message composer
    - Title, body, CTA
    - Schedule send time
    - Channel (email/SMS/push)
- [ ] Alert Management
  - Configure admin alerts
    - High-value disputes
    - Failed payments
    - System errors
    - Suspicious activity
  - Alert history

---

### 10. **Support & Help Desk** (`/admin/support`)
- [ ] Support Ticket Queue
  - List all tickets
  - Filter by: status (open/in_progress/resolved/closed), category, priority
  - Assign to admin
- [ ] Ticket Details
  - User information
  - Issue description
  - Chat/message thread
  - Internal notes
  - Actions: reply, escalate, close
- [ ] FAQ Management
  - Create/edit/delete FAQs
  - Organize by category
  - Publish/unpublish

---

### 11. **Admin User Management** (`/admin/admins`)
- [ ] Admin List
  - View all admin accounts
  - Role levels (super admin, admin, support, viewer)
- [ ] Admin Actions
  - Create new admin account
  - Assign roles & permissions
  - Deactivate admin
  - View audit log (actions taken by admin)
- [ ] Role-Based Access Control
  - Super Admin: full access
  - Admin: manage users, agents, errands, disputes
  - Support: view-only + handle support tickets
  - Finance: access financial reports & escrow
  - Viewer: read-only access

---

### 12. **Audit Log** (`/admin/audit`)
- [ ] Activity Log
  - All admin actions logged
  - Filter by: admin, action type, date range
  - Search by: user affected, errand ID
- [ ] Log Entry Details
  - Timestamp
  - Admin who performed action
  - Action type (approved KYC, suspended user, released escrow, etc.)
  - Target (user, agent, errand, transaction)
  - Before/after values (for changes)
  - IP address
  - Reason/notes

---

## 🔐 Security Features

- [ ] Two-Factor Authentication (2FA) for admin login
- [ ] IP whitelist (optional)
- [ ] Session timeout (30 min idle)
- [ ] Password policy enforcement
- [ ] Login attempt monitoring
- [ ] Admin action approval workflow (for critical actions)

---

## 📱 UI/UX Requirements

- [ ] Responsive design (works on desktop/tablet)
- [ ] Dark/Light mode
- [ ] Keyboard shortcuts for common actions
- [ ] Quick search (global)
- [ ] Breadcrumb navigation
- [ ] Loading states & spinners
- [ ] Error handling & user-friendly messages
- [ ] Confirmation dialogs for destructive actions
- [ ] Success/error toast notifications
- [ ] Empty states with helpful messages
- [ ] Data export functionality
- [ ] Print-friendly views

---

## 🔌 Backend Integration Requirements

### API Endpoints Needed:

```
GET    /api/admin/dashboard/stats
GET    /api/admin/users?page=1&limit=50&search=&filter=
GET    /api/admin/users/:id
PUT    /api/admin/users/:id/suspend
PUT    /api/admin/users/:id/ban
GET    /api/admin/agents?page=1&limit=50&kyc_status=
GET    /api/admin/agents/:id
PUT    /api/admin/agents/:id/kyc/approve
PUT    /api/admin/agents/:id/kyc/reject
POST   /api/admin/agents/:id/badges
GET    /api/admin/errands?page=1&limit=50&status=
GET    /api/admin/errands/:id
PUT    /api/admin/errands/:id/cancel
GET    /api/admin/escrow/transactions
PUT    /api/admin/escrow/:id/release
PUT    /api/admin/escrow/:id/refund
GET    /api/admin/disputes?status=open
GET    /api/admin/disputes/:id
PUT    /api/admin/disputes/:id/resolve
POST   /api/admin/disputes/:id/message
GET    /api/admin/reports/financial?from=&to=
GET    /api/admin/reports/operational?from=&to=
POST   /api/admin/notifications/send
GET    /api/admin/settings
PUT    /api/admin/settings
GET    /api/admin/audit-log?page=1&admin_id=
POST   /api/admin/login
POST   /api/admin/logout
POST   /api/admin/2fa/verify
```

---

## ✅ Implementation Checklist

### Phase 1: Core Admin Setup
- [ ] Create `/admin` route structure
- [ ] Admin authentication & authorization
- [ ] Admin layout & navigation
- [ ] Dashboard with real-time stats

### Phase 2: User & Agent Management
- [ ] User list & details pages
- [ ] Agent list & details pages
- [ ] KYC review interface
- [ ] Badge management

### Phase 3: Operational Management
- [ ] Errand management
- [ ] Escrow management
- [ ] Dispute management

### Phase 4: Configuration & Reports
- [ ] Settings page
- [ ] Reports & analytics
- [ ] Notification system

### Phase 5: Polish & Security
- [ ] Audit logging
- [ ] 2FA implementation
- [ ] UI polish & responsive design
- [ ] Testing & bug fixes

