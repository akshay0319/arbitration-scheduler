## Overview

This is a simple calendar scheduling app built with React and Next.js. It allows an admin to schedule arbitration sessions, and claimants/respondents to view their assigned sessions.

## How to Run

1. Install dependencies:

   npm install

2. Start the development server:

   npm run dev

3. Open in browser:

   http://localhost:3000

## Test Login Credentials

Admin:

- Email: admin@demo.com
- Password: password123

Claimant:

- Email: claimant@demo.com
- Password: password123

Respondent:

- Email: respondent@demo.com
- Password: password123

## User Roles

Abitrator:

- Can create, edit, and delete sessions
- Has full access to the calendar

Claimant and Respondent:

- Can only view their own sessions
- Cannot create or modify sessions

## Files

- `page.tsx`: Main login and calendar routes
- `CalendarView.jsx`: Displays day/week/month view
- `SessionModal.jsx`: Used to add or edit a session
- `DeleteConfirmModal.jsx`: Confirms deletion of a session
- `calendarUtils.ts`: Generates calendar date/time values

## Notes

- This is a demo app using only localStorage (no backend).
- Sessions are stored in the browser.
- Built using Tailwind CSS for basic styling.
