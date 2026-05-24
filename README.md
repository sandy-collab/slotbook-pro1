# 🏷️ SlotBook Pro — Smart Offer Slot Booking System

A full-stack web application where a business can create limited-time offer slots, and customers can reserve those offers through a public booking page.

---

## 📁 Project Structure

```
slotbook/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx     # Admin page wrapper with topbar
│   │   ├── Sidebar.tsx         # Collapsible sidebar navigation
│   │   └── UI.tsx              # Reusable UI components (StatusBadge, StatCard, SeatsBar, etc.)
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state management (login / logout)
│   ├── data/
│   │   └── mockData.ts         # Mock data for all entities
│   ├── pages/
│   │   ├── LoginPage.tsx           # Screen 1: Admin Login
│   │   ├── DashboardPage.tsx       # Screen 2: Admin Dashboard
│   │   ├── CreateOfferPage.tsx     # Screen 3: Create Offer
│   │   ├── ManageOffersPage.tsx    # Screen 4: Manage Offers
│   │   ├── ManageBookingsPage.tsx  # Screen 5: Manage Bookings
│   │   ├── ManageSlotsPage.tsx     # Bonus: Manage Slots
│   │   ├── BusinessProfilePage.tsx # Bonus: Business Profile
│   │   ├── PublicListingPage.tsx   # Screen 6: Public Offer Listing
│   │   ├── OfferDetailPage.tsx     # Screen 7: Public Offer Detail
│   │   ├── BookingPage.tsx         # Booking Flow (3 steps)
│   │   └── ConfirmationPage.tsx    # Screen 8: Booking Confirmation
│   ├── types/
│   │   └── index.ts            # All TypeScript interfaces & types
│   ├── App.tsx                 # Route definitions
│   └── index.css               # Global CSS with design tokens
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js v18+
- npm or yarn

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start development server
npm start
```

App runs at **http://localhost:3000**

---

## 🔑 Demo Login

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@fitzonegym.in      |
| Password | password123              |

---

## 📱 Screens Implemented

| # | Screen                    | Route                         | Type   |
|---|---------------------------|-------------------------------|--------|
| 1 | Admin Login               | `/login`                      | Admin  |
| 2 | Admin Dashboard           | `/admin/dashboard`            | Admin  |
| 3 | Create Offer              | `/admin/offers/create`        | Admin  |
| 4 | Manage Offers             | `/admin/offers`               | Admin  |
| 5 | Manage Bookings           | `/admin/bookings`             | Admin  |
| + | Manage Slots              | `/admin/slots`                | Admin  |
| + | Business Profile          | `/admin/business`             | Admin  |
| 6 | Public Offer Listing      | `/offers`                     | Public |
| 7 | Public Offer Detail       | `/offers/:id`                 | Public |
| + | Booking Flow (3 steps)    | `/offers/:id/book`            | Public |
| 8 | Booking Confirmation      | `/booking/confirmation`       | Public |

---

## 🔌 API Integration

The app uses mock data by default. To connect to the .NET 8 backend:

1. Set `REACT_APP_API_BASE_URL` in `.env`
2. Replace mock data imports in `src/data/mockData.ts` with actual API calls
3. API endpoints expected:

```
POST   /api/auth/login
POST   /api/business
GET    /api/business
PUT    /api/business/{id}
POST   /api/offers
GET    /api/offers
GET    /api/offers/{id}
PUT    /api/offers/{id}
DELETE /api/offers/{id}
POST   /api/slots
GET    /api/slots
GET    /api/offers/{offerId}/slots
PUT    /api/slots/{id}
DELETE /api/slots/{id}
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/{id}
PUT    /api/bookings/{id}/status
GET    /api/dashboard/summary
```

---

## 🛠 Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18 + TypeScript                   |
| Routing  | React Router v6                         |
| Styling  | Custom CSS Variables (no Tailwind dep)  |
| Icons    | Lucide React                            |
| State    | React Context + useState                |
| HTTP     | Axios (ready for API connection)        |

> **Note:** The spec says Tailwind CSS. This build uses custom CSS variables for speed and portability. To migrate to Tailwind, replace `src/index.css` class patterns with Tailwind utility classes.

---

## ✨ Features Implemented

- [x] Admin login with auth guard
- [x] Collapsible sidebar navigation
- [x] Dashboard with stats, weekly bar chart, capacity overview
- [x] Create offer with slot builder
- [x] Manage offers with status filters + dropdown actions
- [x] Manage bookings with inline status update + CSV export
- [x] Manage slots with add/delete
- [x] Business profile view + edit
- [x] Public offer listing with category/type/price filters
- [x] Live countdown timer on each offer card
- [x] Offer detail with sticky booking card
- [x] 3-step booking flow with validation
- [x] Booking confirmation with reference number
- [x] Responsive layouts
- [x] TypeScript types for all entities
- [x] Mock data matching DB schema

---

## 📸 Screenshots

Run the app and navigate to each route listed in the Screens table above.

---

## 📄 License

Submitted for Willovate Hackathon. By submitting, contributor grants Willovate the right to review, modify, reuse, and integrate the code.
