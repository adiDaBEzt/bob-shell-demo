# Galaxium Travels - Frontend Build Specification

## Project Goal
Build a modern React frontend for an interplanetary flight booking system with customer and staff modes (for booking agency employees).

---

## Tech Stack Requirements

### Core Technologies
- **React 18.2+** with TypeScript
- **Vite 5.0+** as build tool
- **React Router 6.20+** for routing
- **Tailwind CSS 3.3+** for styling

### State Management
- **TanStack Query 5.12+** for server state (API data, caching)
- **Zustand 4.4+** for client state (user session, UI state)

### UI Components
- **Shadcn/ui** components (built on Radix UI)
- **Lucide React** for icons
- **Framer Motion** for animations (optional)

### Forms & Validation
- **React Hook Form 7.48+**
- **Zod 3.22+** for schema validation

---

## Backend API Contract

### Base URL
`http://localhost:8082`

### Important: Response Format
Most endpoints wrap responses in a success object:
```json
{
  "success": true,
  "data": { /* actual data */ }
}
```

**Exception**: `/register` and `/flights` return data directly.

**Frontend must handle both formats**: `response.data.data || response.data`

### API Endpoints

#### 1. User Registration
```
POST /register
Body: { "name": string, "email": string }
Response: User object (direct, not wrapped)
```

#### 2. User Lookup
```
GET /user_id?name=string&email=string
Response: { "success": true, "data": User }
```

#### 3. List Flights
```
GET /flights
Response: Flight[] (direct, not wrapped)
```

#### 4. Create Booking
```
POST /book
Body: { "user_id": number, "name": string, "flight_id": number }
Response: { "success": true, "data": Booking }
```

#### 5. Get User Bookings
```
GET /bookings/{user_id}
Response: { "success": true, "data": Booking[] }
```

#### 6. Cancel Booking
```
POST /cancel/{booking_id}
Response: { "success": true, "data": Booking }
```

### Data Models

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface Flight {
  id: number;
  origin: string;
  destination: string;
  departure_time: string;  // ISO 8601
  arrival_time: string;    // ISO 8601
  price: number;
  available_seats: number;
}

interface Booking {
  id: number;
  user_id: number;
  flight_id: number;
  status: 'booked' | 'cancelled' | 'completed';
  booking_time: string;    // ISO 8601
  flight?: Flight;         // Populated in bookings list
  user?: User;             // Populated in agent view
}
```

---

## Design Requirements

### Theme: Dark Space
- Background: `#0a0e27` (deep space blue)
- Surface: `#1a1f3a` (dark blue-gray)
- Accent: `#6366f1` (cosmic indigo), `#8b5cf6` (cosmic purple)
- Text: `#f8fafc` (near white), `#cbd5e1` (light gray)

### Visual Effects
- **Glassmorphism**: Cards with `bg-white/5 backdrop-blur-md border border-white/10`
- **Animated Starfield**: Canvas-based background with twinkling stars
- **Smooth Transitions**: 200-300ms for all interactions
- **Cosmic Gradients**: `linear-gradient(to right, #6366f1, #8b5cf6)`

### Typography
- Body: Inter or system font
- Headings: Space Grotesk or similar
- Monospace: For booking IDs and codes

---

## Required Features

### Customer Mode

#### 1. Landing Page (`/`)
- Hero section with animated starfield
- "Explore the Galaxy" headline
- Registration modal/form
- Feature cards (Fast Travel, Premium Service, Multiple Destinations)
- "Browse Flights" CTA button

#### 2. Registration Flow
- Modal dialog with form
- Fields: Full Name (min 2 chars), Email (validated)
- Store user in Zustand + localStorage
- Handle duplicate email errors
- Redirect to flights after success

#### 3. Flights Page (`/flights`)
- Grid of flight cards
- Each card shows:
  - Origin → Destination
  - Departure/arrival times (formatted)
  - Flight duration (calculated)
  - Price (prominent)
  - Available seats
  - "Book Now" button
- Loading and error states

#### 4. Booking Page (`/book/:flightId`)
- Flight details summary
- User verification (auto-fill if logged in)
- Confirmation checkbox
- Submit booking
- Success screen with:
  - **Booking ID** (must display correctly!)
  - Flight details
  - Total paid
  - "View My Bookings" and "Book Another Flight" buttons

#### 5. My Bookings Page (`/my-bookings`)
- List user's bookings
- Each card shows:
  - Booking ID and status badge (color-coded)
  - Flight details
  - Booking timestamp
  - Cancel button (only for "booked" status)
- Cancel flow with confirmation

### Staff Mode (Booking Agency Employees)

#### 6. Staff Dashboard (`/staff`)
- Customer search (by name + email)
- Display customer details
- Quick booking interface
- Recent bookings overview

#### 7. Staff Bookings Page (`/staff/bookings`)
- List ALL bookings in system
- Filter/search capabilities
- Cancel bookings on behalf of customers
- Detailed booking information

### Mode Switching
- Toggle button in header
- Switch between Customer and Staff modes
- Persist preference in localStorage
- Different navigation menus per mode

---

## State Management Strategy

### Client State (Zustand)
```typescript
interface UserState {
  user: User | null;
  isStaff: boolean;           // Staff mode flag (booking agency employee)
  setUser: (user: User | null) => void;
  clearUser: () => void;
  toggleMode: () => void;     // Switch between customer/staff modes
}
```
- Persist to localStorage
- Rehydrate on app load

### Server State (TanStack Query)
- Query keys: `['flights']`, `['bookings', userId]`
- Cache flights for 5 minutes
- Cache bookings for 1 minute
- Automatic refetch on window focus
- Optimistic updates for mutations
- 3 retry attempts on failure

---

## Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with interceptors
│   └── endpoints.ts       # API functions (handle response unwrapping!)
├── components/
│   ├── ui/                # Shadcn/ui base components
│   ├── layout/            # Header, Footer, Layout
│   ├── customer/          # RegistrationModal
│   └── shared/            # Starfield
├── pages/
│   ├── customer/          # HomePage, FlightsPage, BookingPage, MyBookingsPage
│   └── staff/             # StaffDashboard, StaffBookingsPage
├── hooks/                 # useFlights, useBookings, useUser
├── store/                 # userStore.ts (Zustand)
├── lib/                   # queryClient.ts, utils.ts
├── types/                 # index.ts (TypeScript definitions)
├── App.tsx                # Router setup
├── main.tsx               # Entry point
└── index.css              # Global styles + Tailwind
```

---

## Critical Implementation Notes

### 1. API Response Unwrapping
**MUST** handle wrapped responses in `endpoints.ts`:
```typescript
export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  const response = await apiClient.post('/book', data);
  return response.data.data || response.data;  // Extract from wrapper!
};
```

Apply to: `createBooking`, `getUserBookings`, `cancelBooking`, `getUserByNameAndEmail`

### 2. Registration Modal Rendering
**MUST** render RegistrationModal in:
- HomePage (for new users)
- Header (for easy access when not logged in)

### 3. Booking ID Display
After booking, extract and display `booking.id` from the response.
Add console logging for debugging: `console.log('Booking created:', booking);`

### 4. User Session Persistence
- Store user in Zustand with localStorage persistence
- Check for existing user on app load
- Clear user on logout

### 5. Error Handling
Display user-friendly messages for error codes:
- `EMAIL_EXISTS`: "This email is already registered"
- `FLIGHT_NOT_FOUND`: "This flight is no longer available"
- `NO_SEATS_AVAILABLE`: "Sorry, this flight is fully booked"
- `USER_NOT_FOUND`: "Please register or check your details"
- `NAME_MISMATCH`: "Name doesn't match your account"

---

## Setup Steps

1. **Initialize Project**
   ```bash
   npm create vite@latest . -- --template react-ts
   ```

2. **Install Dependencies**
   ```bash
   npm install react-router-dom axios @tanstack/react-query zustand
   npm install react-hook-form zod @hookform/resolvers
   npm install lucide-react date-fns clsx tailwind-merge
   npm install @radix-ui/react-dialog @radix-ui/react-label
   npm install class-variance-authority
   npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
   ```

3. **Configure Tailwind**
   ```bash
   npx tailwindcss init -p
   ```
   Add custom colors and animations to `tailwind.config.js`

4. **Configure Vite**
   - Add path alias: `@` → `./src`
   - Set dev server port: 3000
   - Add proxy for `/api` → `http://localhost:8082`

5. **Environment Variables**
   ```env
   VITE_API_BASE_URL=http://localhost:8082
   VITE_APP_NAME=Galaxium Travels
   ```

---

## Testing Checklist

- [ ] User can register with name and email
- [ ] Registration modal appears on homepage and header
- [ ] User can browse all flights
- [ ] User can book a flight
- [ ] **Booking ID displays correctly after booking**
- [ ] User can view their bookings
- [ ] User can cancel a booking
- [ ] Seat count updates after booking/cancellation
- [ ] Staff can search for customers
- [ ] Staff can view all bookings
- [ ] Staff can cancel bookings for customers
- [ ] Mode toggle works and persists
- [ ] User session persists across page refreshes
- [ ] Error messages display correctly
- [ ] Loading states show during API calls
- [ ] Starfield animation runs smoothly

---

## Common Pitfalls to Avoid

1. **Forgetting to unwrap API responses** → Booking ID will be null
2. **Not rendering RegistrationModal** → Users can't register
3. **Not persisting user state** → Session lost on refresh
4. **Not handling loading states** → Poor UX during API calls
5. **Not validating forms** → Bad data sent to backend
6. **Not handling errors** → Users see cryptic error messages
7. **Hardcoding API URL** → Use environment variables
8. **Not using React Query cache** → Unnecessary API calls

---

## Success Criteria

- All customer flows work end-to-end
- All staff flows work end-to-end
- Booking ID displays after successful booking
- User session persists across refreshes
- Error handling is user-friendly
- UI is responsive and visually appealing
- Starfield animation enhances the space theme
- No console errors in production build

---

**Version**: 1.0  
**Last Updated**: 2025-11-20  
**Purpose**: Specification for building Galaxium Travels frontend from scratch