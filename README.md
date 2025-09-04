# 💰 Expense Tracker - Mobile-First PWA

A modern, mobile-first expense tracking Progressive Web App built with Next.js 14, TypeScript, and Tailwind CSS. Track your expenses, income, investments, and money lent with ease!

## ✨ Features

### Core Functionality
- 📊 **Dashboard** - View all your financial stats at a glance
- 💸 **Expense Tracking** - Add and categorize your daily expenses
- 💵 **Income Management** - Track multiple income sources
- 📈 **Investment Tracking** - Monitor your investments
- 🤝 **Money Lent Tracker** - Keep track of money you've lent to others
- 📱 **PWA Support** - Install as a mobile app for quick access
- 🌙 **Dark/Light Mode** - Theme toggle for comfortable viewing
- 💾 **Offline Support** - Works offline with local data storage

### Analytics & Insights
- 📊 **Monthly/Weekly Tracking** - Detailed breakdown of your finances
- 📈 **Insights Page** - Smart insights and spending pattern analysis
- 📉 **Charts & Visualizations** - Beautiful charts using Recharts
- 💾 **Data Export** - Export your data in JSON format

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Mobile Installation

This app can be installed on your mobile device as a PWA:

1. Open the app in your mobile browser
2. For iOS: Tap the share button and select "Add to Home Screen"
3. For Android: You'll see an install prompt or use the menu option "Add to Home Screen"

## 🎯 Usage Guide

### Adding Expenses
1. Click the floating "+" button on any screen
2. Fill in the expense details:
   - Date
   - Payment method (Online/Cash/Credit Card)
   - Title and description
   - Amount
   - Category
3. Click "Add Expense"

### Adding Income
1. Open the sidebar menu
2. Select "Add Income"
3. Enter income details:
   - Source
   - Amount
   - Category (Salary, Freelance, etc.)
4. Save the entry

### Tracking Money Lent
1. Navigate to "Money Lent" from the sidebar
2. Click "Add Record"
3. Enter:
   - Person's name
   - Amount lent
   - Reason (optional)
   - Date
4. Mark as returned when the money is paid back

### Viewing Analytics
- **Monthly Tracking**: See month-by-month expense trends
- **Weekly Tracking**: View weekly spending patterns
- **Insights**: Get smart insights about your spending habits

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components inspired by shadcn/ui
- **Database**: IndexedDB (via Dexie.js) for local storage
- **Charts**: Recharts
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Animations**: Framer Motion
- **Notifications**: Sonner

## 📂 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard/Home page
│   ├── money-lent/        # Money lent tracker
│   ├── tracking/          # Monthly/Weekly tracking
│   └── insights/          # Analytics insights
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components (Header, Sidebar)
│   ├── forms/            # Form components
│   └── dashboard/        # Dashboard specific components
├── lib/                  # Utility functions and database
│   ├── db.ts            # Database setup and helpers
│   └── utils.ts         # Utility functions
├── store/               # Zustand store
└── types/               # TypeScript type definitions
```

## 🎨 Features Breakdown

### Expense Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Others

### Income Categories
- Salary
- Freelance
- Business
- Interest
- Dividends
- Gift
- Others

### Investment Types
- Stocks
- Mutual Funds
- Gold
- ETFs
- Fixed Deposits
- Others

## 🔧 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 📱 PWA Features

- **Offline Support**: App works offline with cached data
- **Install Prompt**: Users can install the app on their devices
- **App Icons**: Custom icons for different screen sizes
- **Splash Screen**: Beautiful loading screen
- **Service Worker**: Background sync and caching

## 🎯 Key Features

1. **Real-time Updates**: All data updates instantly across the app
2. **Responsive Design**: Works perfectly on mobile, tablet, and desktop
3. **Data Persistence**: All data stored locally in IndexedDB
4. **Smart Insights**: Get recommendations based on spending patterns
5. **Beautiful UI**: Modern, clean interface with smooth animations
6. **Fast Performance**: Optimized for speed and efficiency

## 📊 Dashboard Stats

The dashboard shows:
- Monthly Expenses
- Daily Expenses
- Monthly Income
- Current Balance
- Total Investments
- Credit Card Spending

## 🤝 Contributing

Feel free to contribute to this project by:
1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🌟 Acknowledgments

- Built with Next.js and React
- UI components inspired by shadcn/ui
- Icons from Lucide React
- Charts powered by Recharts

---

**Happy Tracking! 💰📊**