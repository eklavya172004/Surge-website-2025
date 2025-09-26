# Dashboard Features to Reimplement

## Core Functionality

### Authentication & Authorization
- Protected routes that require authentication
- Email verification requirement
- Session management using NextAuth

### Event Registration
- Browse available events
- Select event and configure team size
- Add player details (name, email, roll number, phone)
- Team creation and management
- Validation for min/max team sizes
- Integration with TRPC `trpc.reg.getAvailableSports` and `trpc.reg.createTeamWithMembers`

### Cart Management
- View selected events/teams
- Remove items from cart
- Calculate total cost
- Proceed to payment
- Integration with TRPC `trpc.reg.getCart` and `trpc.reg.deleteTeamFromCart`

### Profile Management
- Display user information (name, email, college, phone)
- Show verification status
- Form for editing profile (to be implemented)
- Integration with session data

### My Events
- Display user's registered events
- Show team members for each event
- Show payment status
- Show event details (venue, price)
- Integration with TRPC `trpc.event.getMyEvents`

### Accommodation
- Manage accommodation details for events
- Select dates and number of beds
- Calculate total cost based on rates
- Handle different categories (MALE/FEMALE/MIXED)
- QR code payment flow
- Integration with TRPC `trpc.accommodation.getAccomodationTeams`, `trpc.accommodation.saveAccommodationDetails`, `trpc.accommodation.accommodationCheckout`

## UI Components & Libraries Used
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS with gradient styling
- Responsive design for all screen sizes
- Loading states and error handling
- Form validation
- Modal dialogs

## TRPC Endpoints to Maintain
- `trpc.reg.getAvailableSports`
- `trpc.reg.createTeamWithMembers`
- `trpc.reg.getEventDetails`
- `trpc.reg.getCart`
- `trpc.reg.deleteTeamFromCart`
- `trpc.event.getMyEvents`
- `trpc.event.getAllEvents`
- `trpc.accommodation.getAccomodationTeams`
- `trpc.accommodation.saveAccommodationDetails`
- `trpc.accommodation.accommodationCheckout`
- `trpc.user.getUserProfile` (for profile page)

## Layout Structure
- Protected route wrapper
- Dashboard layout with navigation
- Client-side session handling
- Consistent styling across all components