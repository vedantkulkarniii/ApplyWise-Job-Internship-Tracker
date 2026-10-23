# ApplyWise - Quick Start Guide

## ✅ Application is Running!

Your ApplyWise application is currently running at: **http://localhost:3000**

## 🚀 What's Working

### 1. Dashboard (/)
- **Total Applications Counter** - Shows real count from your data
- **Applied Counter** - Tracks submitted applications
- **Interviews Counter** - Counts assessment and interview stages
- **Offers Counter** - Tracks offers and accepted positions
- **Rejected Counter** - Monitors rejections
- **Status Distribution Chart** - Visual breakdown by status
- **Recent Applications List** - Shows last 5 applications
- **Load Sample Data Button** - Appears when no data exists

### 2. Applications Page (/applications)
- **Add Application** - Full form with all fields working
- **Edit Application** - Click edit icon to modify any application
- **Delete Application** - With confirmation modal
- **Search** - Real-time search by company, role, or location
- **Filter by Status** - All 8 statuses supported
- **Filter by Job Type** - Full-time, Internship, Part-time, Contract
- **View Job URL** - External link icon opens job posting
- **Data Table** - Sortable, responsive table view

### 3. Interviews Page (/interviews)
- **Add Interview** - Link to existing applications
- **Upcoming Interviews** - Shows future interviews with countdown
- **Past Interviews** - Historical interview records
- **Interview Details** - Type, date, time, interviewer, notes, outcome
- **Date/Time Display** - Proper formatting for dates and times

### 4. Reminders Page (/reminders)
- **Overdue Deadlines** - Red alert for missed deadlines
- **Upcoming Interviews** - Next 10 interviews with countdown
- **Application Deadlines** - Deadline tracking
- **Follow-ups Needed** - Scheduled follow-up dates
- **Smart Countdown** - "Today", "Tomorrow", "In X days"

## 📝 How to Use

### Adding Your First Application

1. Go to http://localhost:3000/applications
2. Click "Add Application"
3. Fill in:
   - **Company Name** (required): e.g., "Google"
   - **Job Role** (required): e.g., "Software Engineering Intern"
   - **Job Type** (required): Select from dropdown
   - **Location** (required): e.g., "Mountain View, CA"
   - **Application Date** (required): When you applied
   - **Status** (required): Current application status
   - **Job URL** (optional): Link to job posting
   - **Salary/Stipend** (optional): e.g., "$8,000/month"
   - **Deadline** (optional): Application deadline
   - **Follow-up Date** (optional): When to follow up
   - **Notes** (optional): Any additional information
4. Click "Add Application"

### Testing with Sample Data

1. Go to http://localhost:3000 (Dashboard)
2. If the dashboard is empty, you'll see a "Load Sample Data" button
3. Click it to load 8 sample applications and 5 sample interviews
4. Explore all features with realistic data

### Tracking Interviews

1. Navigate to http://localhost:3000/interviews
2. Click "Add Interview"
3. Select an application from the dropdown
4. Enter:
   - **Interview Type**: e.g., "Technical Phone Screen", "Final Round"
   - **Date & Time**: When the interview is scheduled
   - **Interviewer** (optional): Name of the interviewer
   - **Outcome** (optional): "Passed", "Pending", etc.
   - **Notes** (optional): Preparation notes, topics discussed
5. Save the interview

### Managing Application Status

1. Go to Applications page
2. Click the Edit icon (pencil) on any application
3. Change the Status dropdown to update progress:
   - Wishlist → Applied → Online Assessment → Interview → Offer → Accepted
   - Or mark as Rejected/Withdrawn
4. Save changes

### Searching and Filtering

**Search:**
- Type in the search box at the top of Applications page
- Searches company name, job role, and location instantly

**Filter by Status:**
- Use the "All Statuses" dropdown
- Select any status to show only those applications

**Filter by Job Type:**
- Use the "All Job Types" dropdown
- Filter by Full-time, Internship, Part-time, or Contract

## 🎯 Application Statuses Explained

1. **Wishlist** - Jobs you want to apply to (not yet applied)
2. **Applied** - You've submitted your application
3. **Online Assessment** - You received a coding test or OA
4. **Interview** - Interview scheduled or in progress
5. **Offer** - You received a job offer
6. **Accepted** - You accepted the offer
7. **Rejected** - Application was rejected
8. **Withdrawn** - You withdrew your application

## 💾 Data Storage

- All data is stored in your browser's **localStorage**
- Data persists when you close and reopen the browser
- Data is **private to your browser**
- To reset: Clear browser data or use Developer Tools → Application → Local Storage

## 🔧 Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 🌐 Navigation

- **Dashboard**: http://localhost:3000
- **Applications**: http://localhost:3000/applications
- **Interviews**: http://localhost:3000/interviews
- **Reminders**: http://localhost:3000/reminders

## ✨ Features Working

✅ Responsive sidebar navigation  
✅ Add/Edit/Delete applications  
✅ Search applications  
✅ Filter by status and job type  
✅ Track interview rounds  
✅ View upcoming interviews  
✅ Monitor deadlines and follow-ups  
✅ Real-time dashboard statistics  
✅ Status distribution visualization  
✅ Recent applications feed  
✅ Overdue deadline alerts  
✅ localStorage data persistence  
✅ Mobile-responsive design  
✅ Clean, modern UI with Tailwind CSS  

## 🚫 Known Limitations

- No user authentication (single-user app)
- No backend database (localStorage only)
- No email notifications
- No resume file uploads (not implemented yet)
- No data export functionality
- No cloud sync between devices

## 🎨 Color-Coded Status Badges

- **Wishlist**: Gray
- **Applied**: Blue
- **Online Assessment**: Purple
- **Interview**: Yellow
- **Offer**: Green
- **Accepted**: Emerald
- **Rejected**: Red
- **Withdrawn**: Orange

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔍 Testing Checklist

- [x] Dashboard loads and shows stats
- [x] Add new application works
- [x] Edit application works
- [x] Delete application works
- [x] Search applications works
- [x] Filter by status works
- [x] Filter by job type works
- [x] Add interview works
- [x] View upcoming interviews works
- [x] View past interviews works
- [x] Reminders page shows deadlines
- [x] Overdue items highlighted
- [x] Navigation between pages works
- [x] Data persists on page refresh
- [x] Responsive on mobile
- [x] Production build succeeds

## 🎉 You're All Set!

Your ApplyWise application is fully functional and ready to use. Start tracking your job applications now!

Visit: http://localhost:3000
