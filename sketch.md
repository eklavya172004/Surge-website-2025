# Old Website Sketch

## Overview
The old Surge website was built using the T3 Stack with Next.js, Chakra UI, and various other technologies. It featured a dynamic landing page with animated sections, a dashboard for registered users, and detailed event information.

## Main Technologies Used
- Next.js (v14.2.4)
- Chakra UI for styling
- Framer Motion for animations
- Prisma for database operations
- NextAuth for authentication
- tRPC for API routes
- TypeScript

## Website Structure

### Landing Page (`/`)
The landing page was the main entry point with several animated sections:

1. **Hero Section**
   - Large banner with tagline "The home of champions"
   - Event description text
   - "Register Now" button
   - Event dates display
   - Scroll indicator

2. **Aftermovie Section**
   - Embedded YouTube video link for event highlights

3. **Stats Section**
   - Animated scrolling text banner with "Compete Conquer Celebrate"
   - Statistics display:
     - Teams: 109+
     - Events: 25+
     - Players: 2500+
     - Footfall: 15k+
     - Sweat: ∞

4. **Sports Section**
   - Display of 14+ sports events with images and descriptions:
     - Football (2 entries)
     - Badminton
     - Athletics
     - Basketball
     - Powerlifting
     - Cricket
     - Volleyball
     - Table Tennis
     - Lawn Tennis
     - Squash
     - Chess
     - Valorant (E-Sport)
     - Futsal

5. **Sponsors Section**
   - Display of sponsor logos with links:
     - HCL
     - Stag
     - Wai Wai
     - Dassault Systemes

### Authentication Pages
- **Login** (`/login`)
- **Register** (`/register`)

### Dashboard (`/dashboard`)
User dashboard with multiple sections:
- **Main Dashboard** (`/dashboard`)
- **All Events** (`/dashboard/all-events`)
- **My Events** (`/dashboard/my-events`)
- **Accommodation** (`/dashboard/accommodation`)
- **Cart** (`/dashboard/cart`)

### Other Pages
- **Contact** (`/contact`)
- **Scoreboard** (`/scoreboard`) - For viewing event results

## Design Elements
- Dark theme with red (#830212) and gold (#F4AC17) accent colors
- Animated scrolling text elements
- Parallax scrolling effects using Framer Motion
- Responsive design for mobile and desktop
- Custom fonts (Alfa Slab One, Migra, Poppins)

## Features
1. **User Authentication**
   - Registration and login system
   - Session management with NextAuth

2. **Event Management**
   - Browse all events
   - Register for events
   - View registered events
   - Shopping cart for event registration

3. **Accommodation Booking**
   - Dedicated section for booking accommodation

4. **Social Media Integration**
   - Links to Instagram, LinkedIn, and YouTube

5. **Responsive Design**
   - Mobile-friendly navigation with overlay menu
   - Different layouts for mobile and desktop views

## Known Issues/Incomplete Features
- Some commented-out code for scroll effects (Lenis library)
- Some commented-out sections (Sponsors section on homepage)
- Some placeholder images with "tempImg" references

## Assets
- Custom images for each sport
- Sponsor logos
- Event branding assets
- Social media icons from react-icons