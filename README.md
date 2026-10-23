# ApplyWise - Job & Internship Tracker

A full-stack web application to track job applications, internships, interviews, and deadlines efficiently.

## Features

✅ **Dashboard**: View statistics including total applications, interviews, offers, and rejections with real-time data
✅ **Application Management**: Add, edit, delete, and view job/internship applications
✅ **Search & Filter**: Search by company/role/location and filter by status or job type
✅ **Interview Tracking**: Schedule and track interview rounds with dates, types, and outcomes
✅ **Reminders**: View upcoming interviews, application deadlines, and follow-ups
✅ **Status Tracking**: Track application status from Wishlist to Offer/Rejected
✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
✅ **Data Persistence**: All data stored in browser localStorage

## Tech Stack

- **Frontend**: Next.js 15 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Storage**: Browser localStorage (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vedantkulkarniii/ApplyWise-Job-Internship-Tracker.git
cd ApplyWise-Job-Internship-Tracker
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

## Usage

### Adding an Application

1. Navigate to the "Applications" page
2. Click "Add Application" button
3. Fill in the required fields:
   - Company Name
   - Job Role
   - Job Type (Full-time/Internship/Part-time/Contract)
   - Location
   - Application Date
   - Status
4. Optionally add: Job URL, Salary, Notes, Deadline, Follow-up Date
5. Click "Add Application"

### Managing Interviews

1. Navigate to the "Interviews" page
2. Click "Add Interview"
3. Select the application
4. Enter interview type, date/time, interviewer, and notes
5. View upcoming and past interviews

### Tracking Reminders

1. Navigate to the "Reminders" page
2. View:
   - Upcoming interviews
   - Application deadlines
   - Follow-ups needed
   - Overdue items

### Dashboard

The dashboard automatically displays:
- Total application count
- Applications by status
- Recent applications
- Status distribution chart

## Application Statuses

- **Wishlist**: Jobs you're interested in applying to
- **Applied**: Applications submitted
- **Online Assessment**: Received OA/coding test
- **Interview**: Interview scheduled/in progress
- **Offer**: Received job offer
- **Accepted**: Offer accepted
- **Rejected**: Application rejected
- **Withdrawn**: You withdrew the application

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
applywise/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard
│   ├── applications/      # Applications page
│   ├── interviews/        # Interviews page
│   └── reminders/         # Reminders page
├── components/            # Reusable components
│   ├── Sidebar.tsx
│   └── StatusBadge.tsx
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript types
│   └── store.ts          # Data storage logic
└── public/               # Static assets
```

## Data Storage

ApplyWise uses browser localStorage for data persistence. This means:
- ✅ No backend setup required
- ✅ Data persists between sessions
- ✅ Works offline
- ⚠️ Data is stored locally per browser
- ⚠️ Clearing browser data will delete applications

## Future Enhancements

- PostgreSQL database integration
- User authentication
- Resume version management
- Email notifications
- Analytics charts with Recharts
- Export data to CSV/PDF
- Cloud deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and portfolio purposes.

## Author

Vedant Kulkarni - Second Year Engineering Student

---

Built with ❤️ for efficient job search management
