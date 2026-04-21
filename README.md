# ☀️ Virtual Energy - Solar Panel Monitoring App

A modern web and mobile application for monitoring solar panel performance, scheduling maintenance, managing alerts, and receiving AI-powered support.

## Features

- **Dashboard**: Real-time production metrics, monthly savings, system status
- **Performance Analytics**: Charts, monthly comparison, efficiency metrics, performance calendar
- **Alerts Management**: Active alerts, severity-based filtering, dismissal functionality
- **Maintenance Scheduling**: Upcoming tasks, completion tracking, date scheduling with modal
- **AI Chat Support**: Claude-powered assistant for instant answers (floating widget)
- **Multi-language Support**: English, Spanish, French, German, Portuguese (auto-detected from browser)
- **Dark/Light Mode**: Theme toggle with persistence
- **Responsive Design**: Mobile-first, works on all devices
- **Real Database**: PostgreSQL via Prisma ORM with 1-year production seed data

## Tech Stack

- **Frontend**: Next.js 16 (TypeScript, React), Tailwind CSS v4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Anthropic Claude 3.5 Sonnet
- **Internationalization**: Custom i18n solution

## Project Structure

solar-app/ ├── app/ # Next.js pages & layout │ ├── dashboard/ # Dashboard page │ ├── alerts/ # Alerts management page │ ├── maintenance/ # Maintenance scheduling page │ ├── performance/ # Performance analytics page │ ├── support/ # AI chat support page │ ├── settings/ # Settings page │ └── api/ # API routes ├── components/ # Reusable React components │ ├── Header.tsx # App header with theme/language toggle │ ├── Navigation.tsx # Sidebar navigation │ ├── ChatWidget.tsx # Floating AI chat widget │ └── Dashboard/ # Dashboard-specific components ├── lib/ # Utility functions & hooks │ ├── prisma.ts # Prisma client │ ├── i18n.ts # Translations & language detection │ ├── fake-data.ts # Database seeding script │ └── hooks/ # Custom React hooks ├── prisma/ # Database schema & migrations ├── public/ # Static assets └── styles/ # Global styles


## Getting Started

### Prerequisites
- Node.js v22+
- npm or yarn

### Installation

# 1. Clone the repository:

git clone https://github.com/yourusername/solar-app.git
cd solar-app
## Install dependencies:
npm install
## Set up environment variables (.env.local):
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY=your_anthropic_api_key
## Initialize database:
npx prisma migrate dev --name init
npx prisma db seed  # Optional: seed with fake data
## Start development server:
npm run dev
## Visit http://localhost:3000 and log in with:
Email: demo@example.com
Password: demo123

## Pages
Page	        Path	        Description
Dashboard	    /dashboard	    Real-time production, savings, alerts, maintenance summary
Performance	    /performance	Historical data, charts, trends, export reports
Alerts	        /alerts	        Active alerts, dismissal, severity filtering
Maintenance	    /maintenance	Upcoming tasks, scheduling, completion tracking
Support	        /support	    AI chat interface with Claude
Settings	    /settings	    Language, notifications, data export

## Scripts
npm run dev                 # Start development server
npm run build               # Build for production
npm run start               # Start production server
npm run lint                # Run ESLint
npx prisma studio           # Open Prisma data browser
npx tsx lib/fake-data.ts    # Seed database with 1-year data

# 2. Database Schema

Main Tables
- User: Authentication, language preference, theme
- System: Solar system details, size, location, inverter type
- DailyProduction: Historical production data (1 per day)
- Alert: System alerts (warnings, info)
- MaintenanceTask: Scheduled maintenance tasks
- SupportMessage: Chat history with escalation flag

# 3. Future Enhancements

- Connect real inverter APIs (Fronius, Enphase, SMA)
- Add NextAuth.js for production authentication
- Implement service booking integration
- Add email notifications for alerts
- Deploy to Vercel
- White-label for installers
- Mobile app (React Native)
- Advanced reporting (PDF export)
- VPP (Virtual Power Plant) features
- Battery monitoring & optimization

## Contributing
- Fork the repository
- Create a feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request

# 4. License

MIT License - see LICENSE file for details

Support
For issues, questions, or suggestions, please open a GitHub issue or contact us.

Authors
Christopher Fourquier - Initial development
Built with ❤️ for sustainable energy monitoring


# Add a LICENSE file** (MIT License):
MIT License

right (c) 2026 Virtual Energy

Permission is hereby granted, free of charge, to any person obtaining a  of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, , modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above right notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR RIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE OR ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**5. Commit initial code:**

git add .
git commit -m "Initial commit: Virtual Energy solar monitoring app

## Features:
- Dashboard with real-time production metrics
- Alerts management with dismissal
- Maintenance scheduling
- Performance analytics with charts
- AI-powered chat support
- Multi-language support (5 languages)
- Dark/Light mode
- Responsive design
- Database with 1-year seed data"

# 6. Create GitHub repository:

Go to https://github.com/new
Repository name: solar-app
Description: "Solar panel monitoring & maintenance app with AI support"
Public/Private: Choose your preference
Click "Create repository"

# 7. Connect and push to GitHub:

git remote add origin https://github.com/yourusername/solar-app.git
git branch -M main
git push -u origin main