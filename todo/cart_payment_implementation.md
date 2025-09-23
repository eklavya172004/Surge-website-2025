# Cart and Payment System Implementation Tasks

## Current State Analysis
- Frontend cart uses localStorage but doesn't connect to database
- Backend has batch-based payment system (multiple teams per payment)
- Admin portal expects batch payment structure
- Missing cart page and payment UI

## Required Implementation Tasks

### 1. Backend (Server-side)
- [ ] Verify existing payment procedures work correctly
  - `calculateTotalAmount` - calculates total for all unpaid teams
  - `finalizePayment` - processes payment for multiple teams

### 2. Frontend (Client-side)

#### 2.1. Cart Page
- [ ] Create `/app/cart/page.tsx`
- [ ] Display localStorage cart items
- [ ] Form for collecting player details for each event
- [ ] "Create Team" button for each cart item
- [ ] Display created teams with payment status

#### 2.2. Cart Client Component
- [ ] Create `/app/components/CartClient.tsx`
- [ ] Handle localStorage cart operations (add/remove items)
- [ ] Manage state for player details collection
- [ ] Call TRPC `createTeamWithMembers` for each cart item

#### 2.3. Payment Component
- [ ] Create or update payment UI component
- [ ] Display individual teams with payment status
- [ ] Show amount calculation before payment
- [ ] Handle payment finalization using existing procedures

### 3. Integration Tasks
- [ ] Connect "Add to Cart" button in event details to localStorage
- [ ] Link cart page to team creation functionality
- [ ] Connect payment component to batch payment processing
- [ ] Add navigation links to cart page

### 4. UI/UX Enhancements
- [ ] Add "Cart" link in navigation
- [ ] Show cart item count in navbar (optional)
- [ ] Display payment status badges (Paid/Pending)
- [ ] Error handling and user feedback

### 5. Testing
- [ ] Test adding items to cart
- [ ] Test creating teams from cart items
- [ ] Test calculating payment amounts
- [ ] Test processing payments for multiple teams
- [ ] Test edge cases and error handling

## Implementation Approach
1. Use existing batch-based payment system (don't change backend structure)
2. Create teams individually from cart items
3. Process payments for all created teams together using existing procedures
4. Maintain compatibility with admin portal queries

## Expected User Flow
1. User adds events to localStorage cart
2. User visits cart page
3. User provides player details for each cart item
4. System creates teams in database
5. User proceeds to payment
6. System calculates total for all unpaid teams
7. User completes payment for all teams at once
8. System updates team records with payment details

## Notes
- Don't modify existing payment procedures
- Keep batch payment approach for admin portal compatibility
- Focus on connecting frontend cart to backend team creation
- Ensure proper error handling throughout the flow