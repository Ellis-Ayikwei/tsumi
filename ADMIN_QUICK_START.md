# Tsumi Admin - Quick Start Guide

## 🚀 Access the Admin Panel

```bash
# Start the development server
cd apps/frontend
npm run dev

# Navigate to admin
http://localhost:3000/admin
```

## 📍 All Admin Routes

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/admin` | Overview stats, activity feed, top agents |
| Users | `/admin/users` | Manage all customers and agents |
| Agents | `/admin/agents` | Agent KYC, badges, performance |
| Errands | `/admin/errands` | Monitor all platform errands |
| Escrow | `/admin/escrow` | Transaction management |
| Disputes | `/admin/disputes` | Resolve customer/agent disputes |
| Settings | `/admin/settings` | Platform configuration |
| Reports | `/admin/reports` | Analytics and data export |

## 🎯 Key Actions Per Page

### Dashboard
- View real-time stats
- Access quick actions (Pending KYC, Urgent Disputes, Stuck Escrow)
- Monitor recent activity
- See top performing agents

### Users
- Search users by name/email/phone
- Filter by role (customer/agent) and status
- View user details (trust score, errands, wallet)
- Export user data

### Agents
- Review pending KYC (15 pending)
- Filter by KYC status and performance
- View agent badges and stats
- Approve/reject agent applications

### Errands
- Monitor all errands (456 today)
- Filter by status (pending/in_progress/completed/cancelled/disputed)
- View errand details and routes
- Export errand data

### Escrow
- View all transactions (₵234,500 in escrow)
- Release funds to agents
- Refund customers
- Review stuck escrow (8 stuck)

### Disputes
- Review open disputes (23 open)
- Filter by priority (urgent/high/medium/low)
- Start investigations
- Resolve disputes in favor of customer/agent

### Settings
- **General:** Platform name, currency, language, timezone
- **Commission:** Platform fee (15%), min/max errand fees, tiered rates
- **Payment:** Enable/disable payment methods, API keys, auto-release timing
- **Features:** Toggle platform features (tracking, chat, tips, etc.)

### Reports
- Generate financial reports (revenue, commission, payouts)
- Export operational reports (errands, completion rates)
- View user growth metrics
- Schedule automated reports

## 🎨 UI Features

- **Dark/Light Mode:** Toggle in top-right header
- **Collapsible Sidebar:** Click arrow to minimize/expand
- **Search:** Global search in header (all pages)
- **Filters:** Each page has relevant filters
- **Pagination:** Navigate large datasets
- **Export:** Download data as PDF/Excel/CSV

## 📊 Quick Stats Overview

| Metric | Value | Change |
|--------|-------|--------|
| Total Users | 12,453 | +12.5% |
| Active Agents | 1,234 | +8.3% |
| Errands Today | 456 | +23.1% |
| Revenue Today | ₵45,230 | +15.3% |
| Escrow Holdings | ₵234,500 | +5.2% |
| Open Disputes | 23 | -12.5% |

## 🔥 Hot Actions

1. **Review Pending KYC** → `/admin/agents?kyc=pending` (15 waiting)
2. **Urgent Disputes** → `/admin/disputes?priority=urgent` (5 urgent)
3. **Stuck Escrow** → `/admin/escrow?status=stuck` (8 stuck)

## 🎯 Common Workflows

### Approve a New Agent
1. Go to `/admin/agents`
2. Click "Review KYC (15)" button
3. Filter by KYC status: "Pending"
4. Click agent name to view details
5. Review documents
6. Approve or Reject

### Resolve a Dispute
1. Go to `/admin/disputes`
2. Filter by "Open" or "Urgent"
3. Click dispute card
4. Review errand details
5. Start investigation or resolve immediately
6. Choose outcome (customer favor / agent favor / split)

### Release Escrow Funds
1. Go to `/admin/escrow`
2. Filter by status: "Holding"
3. Find transaction to release
4. Click "Release" button
5. Confirm action

### Generate a Report
1. Go to `/admin/reports`
2. Select date range (top-right)
3. Choose report template
4. Click format (PDF/Excel/CSV)
5. Download

### Adjust Platform Settings
1. Go to `/admin/settings`
2. Choose tab (General/Commission/Payment/Features)
3. Modify settings
4. Click "Save Changes" (top-right)

## 🔐 Admin Features

### Sidebar Navigation
- Dashboard (Home icon)
- Users (Users icon)
- Agents (Package icon)
- Errands (FileText icon)
- Escrow (Wallet icon)
- Disputes (AlertCircle icon)
- Settings (Settings icon)
- Reports (BarChart3 icon)

### Header Actions
- Global search bar
- Theme toggle (Moon/Sun icon)
- Notifications (Bell icon with badge)
- Admin profile dropdown

### Footer Actions
- Profile settings
- Logout

## 📱 Responsive Design

- **Desktop:** Full sidebar + content area
- **Tablet:** Collapsible sidebar recommended
- **Mobile:** (Needs optimization - currently desktop-first)

## 🎨 Color Scheme

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | gray-50 | gray-950 |
| Surface | white | gray-900 |
| Sidebar | gray-900 | black |
| Primary | purple-600 | purple-600 |
| Text | gray-900 | white |
| Success | green-600 | green-400 |
| Warning | yellow-600 | yellow-400 |
| Error | red-600 | red-400 |

## 🚨 Important Notes

1. **Sharp Edges:** All components have zero border radius
2. **Mock Data:** All data is currently mock data for demonstration
3. **Backend Required:** API integration needed for real functionality
4. **Authentication:** Admin login/auth not yet implemented
5. **Permissions:** Role-based access control ready but not connected

## 🛠️ Development

### Add a New Admin Page
```typescript
// 1. Create page file
apps/frontend/app/admin/my-page/page.tsx

// 2. Add route to sidebar
apps/frontend/components/admin-sidebar.tsx

// 3. Add to navigation array
{ name: "My Page", href: "/admin/my-page", icon: MyIcon }
```

### Connect to Backend
```typescript
// Example API call
const response = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

### Add Loading States
```typescript
const [loading, setLoading] = useState(false);

if (loading) return <div>Loading...</div>;
```

### Add Error Handling
```typescript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  // Show toast notification
}
```

## ✅ Checklist for Production

- [ ] Connect to Django REST API
- [ ] Implement JWT authentication
- [ ] Add role-based access control
- [ ] Implement real-time updates (WebSocket)
- [ ] Add confirmation dialogs for destructive actions
- [ ] Implement toast notifications
- [ ] Add loading skeletons
- [ ] Error boundaries for all pages
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Mobile responsive design
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Security audit
- [ ] Deploy!

## 📚 Reference Documentation

- **Full Feature List:** See `ADMIN_FEATURES.md`
- **Implementation Details:** See `ADMIN_SYSTEM_SUMMARY.md`
- **API Endpoints:** See backend documentation (to be created)

## 🎉 You're Ready!

The admin interface is fully functional with mock data. Start the dev server and explore:

```bash
npm run dev
# Visit http://localhost:3000/admin
```

**Enjoy managing Tsumi! 🚀**

