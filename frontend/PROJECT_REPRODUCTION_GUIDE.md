# Galaxium Travels - Complete Project Reproduction Guide

## Project Overview

**Galaxium Travels** is a full-stack interplanetary flight booking system featuring a modern React frontend and a Python FastAPI backend. The application allows customers to browse and book flights to various planets, while travel agents can manage bookings for multiple customers.

**Project Name**: Galaxium Travels  
**Version**: 1.0.0  
**Created**: 2025-11-19  
**Purpose**: Demo application showcasing modern web development practices with a space-themed booking system

---

## Architecture Overview

### System Components

1. **Frontend**: React 18 + TypeScript + Vite
2. **Backend**: Python FastAPI + SQLite
3. **Communication**: REST API over HTTP
4. **State Management**: TanStack Query (server state) + Zustand (client state)
5. **Styling**: Tailwind CSS + Shadcn/ui components

### Technology Stack

#### Frontend Technologies
- **React 18.2.0** - UI library with hooks and modern features
- **TypeScript 5.3.3** - Static typing for JavaScript
- **Vite 5.0.7** - Fast build tool and dev server
- **React Router 6.20.0** - Client-side routing
- **TanStack Query 5.12.0** - Server state management and caching
- **Zustand 4.4.7** - Lightweight client state management
- **Axios 1.6.2** - HTTP client for API calls
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Shadcn/ui** - Accessible component library built on Radix UI
- **Lucide React 0.294.0** - Icon library
- **Framer Motion 10.16.5** - Animation library
- **React Hook Form 7.48.2** - Form management
- **Zod 3.22.4** - Schema validation

#### Backend Technologies
- **Python 3.11+** - Programming language
- **FastAPI** - Modern web framework
- **SQLite** - Embedded database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

---

## Design System & Visual Identity

### Color Palette (Dark Space Theme)

**Background Colors:**
- Primary Background: `#0a0e27` (Deep space blue)
- Surface: `#1a1f3a` (Dark blue-gray)
- Elevated Surface: `#252b4a` (Lighter blue-gray)

**Accent Colors:**
- Cosmic Indigo: `#6366f1` (Primary actions)
- Cosmic Purple: `#8b5cf6` (Secondary elements)
- Cosmic Cyan: `#06b6d4` (Highlights)

**Semantic Colors:**
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Info: `#3b82f6` (Blue)

**Text Colors:**
- Primary: `#f8fafc` (Near white)
- Secondary: `#cbd5e1` (Light gray)
- Muted: `#94a3b8` (Medium gray)

### Typography
- **Primary Font**: Inter (body text)
- **Heading Font**: Space Grotesk (headings)
- **Monospace**: JetBrains Mono (codes/IDs)

### Visual Effects
- **Glassmorphism**: Cards with `bg-white/5 backdrop-blur-md border border-white/10`
- **Gradients**: Cosmic gradients (`linear-gradient(to right, #6366f1, #8b5cf6)`)
- **Animations**: Smooth transitions (200-300ms), floating effects, twinkling stars
- **Starfield Background**: Animated canvas with twinkling stars and shooting stars

---

## Project Structure

```
bob_demo_frontend/
├── frontend/                          # React frontend application
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── api/                       # API integration layer
│   │   │   ├── client.ts             # Axios instance with interceptors
│   │   │   └── endpoints.ts          # API endpoint definitions
│   │   ├── components/
│   │   │   ├── ui/                   # Shadcn/ui base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── label.tsx
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Header.tsx        # Navigation header
│   │   │   │   ├── Footer.tsx        # Footer
│   │   │   │   └── Layout.tsx        # Main layout wrapper
│   │   │   ├── customer/             # Customer-specific components
│   │   │   │   └── RegistrationModal.tsx
│   │   │   ├── agent/                # Agent-specific components
│   │   │   └── shared/               # Shared components
│   │   │       ├── Starfield.tsx     # Animated starfield background
│   │   │       └── StarfieldCSS.tsx  # CSS-based starfield alternative
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useFlights.ts         # Flight data fetching
│   │   │   ├── useBookings.ts        # Booking operations
│   │   │   └── useUser.ts            # User management
│   │   ├── pages/                    # Page components
│   │   │   ├── customer/
│   │   │   │   ├── HomePage.tsx      # Landing page
│   │   │   │   ├── FlightsPage.tsx   # Browse flights
│   │   │   │   ├── BookingPage.tsx   # Book a flight
│   │   │   │   └── MyBookingsPage.tsx # View user bookings
│   │   │   └── agent/
│   │   │       ├── AgentDashboard.tsx      # Agent main page
│   │   │       └── AgentBookingsPage.tsx   # Manage all bookings
│   │   ├── store/
│   │   │   └── userStore.ts          # Zustand store for user state
│   │   ├── lib/
│   │   │   ├── queryClient.ts        # React Query configuration
│   │   │   └── utils.ts              # Utility functions
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript type definitions
│   │   ├── App.tsx                   # Main app component with routing
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── .env.example                  # Environment variables template
│   ├── .eslintrc.json               # ESLint configuration
│   ├── .prettierrc                  # Prettier configuration
│   ├── index.html                   # HTML template
│   ├── package.json                 # Dependencies and scripts
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vite.config.ts               # Vite configuration
│   └── README.md                    # Frontend documentation
├── python_backend/                   # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI application
│   │   ├── models.py                # SQLAlchemy models
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── database.py              # Database configuration
│   │   └── seed_data.py             # Demo data seeding
│   ├── tests/
│   │   └── test_api.py              # API tests
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Docker configuration
│   └── README.md                    # Backend documentation
└── start.sh                         # Startup script

```

---

## Data Models

### User
```typescript
interface User {
  id: number;              // Auto-generated unique identifier
  name: string;            // User's full name
  email: string;           // Unique email address
}
```

### Flight
```typescript
interface Flight {
  id: number;              // Auto-generated unique identifier
  origin: string;          // Departure planet (e.g., "Earth")
  destination: string;     // Arrival planet (e.g., "Mars")
  departure_time: string;  // ISO 8601 datetime
  arrival_time: string;    // ISO 8601 datetime
  price: number;           // Price in credits (integer)
  available_seats: number; // Current available seats
}
```

### Booking
```typescript
interface Booking {
  id: number;              // Auto-generated unique identifier
  user_id: number;         // Reference to User
  flight_id: number;       // Reference to Flight
  status: 'booked' | 'cancelled' | 'completed';
  booking_time: string;    // ISO 8601 datetime
  flight?: Flight;         // Populated flight details
  user?: User;             // Populated user details
}
```

---

## API Endpoints

### Base URL
- Development: `http://localhost:8082`
- All endpoints return JSON

### Backend Response Format

**Important**: The backend wraps most successful responses in a success object:

```json
{
  "success": true,
  "data": {
    // Actual response data here
  }
}
```

**Exception**: Some endpoints (like `/register` and `/flights`) return data directly without wrapping.

**Frontend Implementation**: The API client in `src/api/endpoints.ts` handles this by extracting data:
```typescript
// Extract data from wrapped response or use direct response
return response.data.data || response.data;
```

This ensures compatibility with both response formats.

### Endpoints

#### 1. Health Check
```
GET /health
Response: { "status": "healthy" }
```

#### 2. User Registration
```
POST /register
Body: { "name": "string", "email": "string" }
Success Response: User object
Error Response: { "success": false, "error": "...", "error_code": "EMAIL_EXISTS" }
```

#### 3. User Lookup
```
GET /user_id?name=string&email=string
Success Response: { "success": true, "data": User object }
Error Response: { "success": false, "error": "...", "error_code": "USER_NOT_FOUND" }

Example Success Response:
{
  "success": true,
  "data": {
    "id": 14,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 4. List Flights
```
GET /flights
Response: Flight[] (array of all flights)
```

#### 5. Create Booking
```
POST /book
Body: { "user_id": number, "name": "string", "flight_id": number }
Success Response: { "success": true, "data": Booking object }
Error Codes: FLIGHT_NOT_FOUND, NO_SEATS_AVAILABLE, USER_NOT_FOUND, NAME_MISMATCH

Example Success Response:
{
  "success": true,
  "data": {
    "id": 25,
    "user_id": 14,
    "flight_id": 1,
    "status": "booked",
    "booking_time": "2025-11-20T09:21:43.376338"
  }
}
```

#### 6. Get User Bookings
```
GET /bookings/{user_id}
Response: { "success": true, "data": Booking[] }

Example Success Response:
{
  "success": true,
  "data": [
    {
      "id": 25,
      "user_id": 14,
      "flight_id": 1,
      "status": "booked",
      "booking_time": "2025-11-20T09:21:43.376338",
      "flight": {
        "id": 1,
        "origin": "Earth",
        "destination": "Mars",
        "departure_time": "2025-12-01T10:00:00",
        "arrival_time": "2025-12-01T18:00:00",
        "price": 5000,
        "available_seats": 49
      }
    }
  ]
}
```

#### 7. Cancel Booking
```
POST /cancel/{booking_id}
Success Response: { "success": true, "data": Updated Booking object }
Error Codes: BOOKING_NOT_FOUND, ALREADY_CANCELLED

Example Success Response:
{
  "success": true,
  "data": {
    "id": 25,
    "user_id": 14,
    "flight_id": 1,
    "status": "cancelled",
    "booking_time": "2025-11-20T09:21:43.376338"
  }
}
```

---

## Key Features & User Flows

### Customer Mode Features

#### 1. Landing Page (HomePage)
- **Purpose**: Welcome users and showcase the service
- **Components**:
  - Hero section with animated starfield background
  - "Explore the Galaxy" headline with gradient text
  - "Browse Flights" call-to-action button
  - Registration section for new users
  - Three feature cards: Fast Travel, Premium Service, Multiple Destinations
- **Visual Effects**: Glassmorphic cards, cosmic gradients, floating animations

#### 2. Registration Flow
- **Trigger**: Click registration button or attempt to book without account
- **Modal Form**:
  - Full Name input (required, min 2 characters)
  - Email input (required, validated format)
  - Real-time validation with error messages
- **Success Flow**:
  - Store user data in Zustand store
  - Persist to localStorage
  - Redirect to flights page
  - Show success toast notification
- **Error Handling**: Display duplicate email errors, validation errors

#### 3. Flights Page (FlightsPage)
- **Purpose**: Browse all available flights
- **Features**:
  - Grid layout of flight cards
  - Each card shows:
    - Origin → Destination with planet names
    - Departure and arrival times (formatted)
    - Flight duration (calculated)
    - Price (prominent display)
    - Available seats indicator
    - "Book Now" button
  - Real-time data fetching with React Query
  - Loading states and error handling
- **Interactions**: Click "Book Now" navigates to booking page

#### 4. Booking Page (BookingPage)
- **Purpose**: Complete flight booking
- **URL**: `/book/:flightId`
- **Form Fields**:
  - User verification (auto-filled if logged in)
  - Flight details summary (read-only)
  - Confirmation checkbox
- **Validation**:
  - User exists in system
  - Name matches user ID
  - Flight has available seats
- **Success Flow**:
  - Create booking via API
  - Show confirmation with booking ID
  - Option to view all bookings
  - Option to book another flight
- **Error Handling**: Display specific error messages with guidance

#### 5. My Bookings Page (MyBookingsPage)
- **Purpose**: View and manage user's bookings
- **Features**:
  - List all bookings for logged-in user
  - Each booking card shows:
    - Booking ID and status badge (color-coded)
    - Flight details (origin, destination, times)
    - Booking timestamp
    - Cancel button (only for "booked" status)
  - Filter by status (future enhancement)
- **Cancel Flow**:
  - Click cancel button
  - Confirmation dialog
  - API call to cancel booking
  - Update UI optimistically
  - Show success notification
  - Seat restored to flight

### Agent Mode Features

#### 6. Agent Dashboard (AgentDashboard)
- **Purpose**: Centralized interface for travel agents
- **Sections**:
  - Customer search widget
  - Quick booking interface
  - Recent bookings overview
- **Customer Search**:
  - Search by name and email
  - Display customer details
  - Quick access to customer's bookings
  - Register new customer button
- **Quick Booking**:
  - Select customer from search results
  - Select flight from dropdown
  - One-click booking
  - Instant confirmation

#### 7. Agent Bookings Management (AgentBookingsPage)
- **Purpose**: View and manage all bookings
- **Features**:
  - List all bookings in the system
  - Advanced filtering options
  - Detailed booking information
  - Cancel bookings on behalf of customers
  - Export functionality (future enhancement)

### Mode Switching
- **Toggle Button**: In header, switches between Customer and Agent modes
- **State Persistence**: Mode preference saved in localStorage
- **Navigation**: Different menu items based on mode
- **Visual Indicator**: Icon changes (User vs Users)

---

## State Management Architecture

### Client State (Zustand)

**User Store** (`userStore.ts`):
```typescript
interface UserState {
  user: User | null;           // Currently logged-in user
  isAgent: boolean;            // Agent mode flag
  setUser: (user: User | null) => void;
  clearUser: () => void;
  toggleMode: () => void;      // Switch between customer/agent
}
```

**Persistence**: 
- Stored in localStorage as `galaxium-user-storage`
- Automatically rehydrated on app load
- Survives page refreshes

### Server State (TanStack Query)

**Query Keys**:
- `['flights']` - All flights list
- `['bookings', userId]` - User-specific bookings

**Mutations**:
- `registerUser` - Create new user
- `createBooking` - Book a flight
- `cancelBooking` - Cancel a booking

**Cache Strategy**:
- Flights: 5 minutes stale time
- Bookings: 1 minute stale time
- Automatic refetch on window focus
- Optimistic updates for mutations
- Automatic retry on failure (3 attempts)

**Query Client Configuration**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});
```

---

## Component Architecture

### Layout Components

#### Header
- **Location**: Sticky top navigation
- **Features**:
  - Logo with link to home
  - Navigation menu (changes based on mode)
  - User display (if logged in)
  - Mode toggle button
- **Responsive**: Hamburger menu on mobile (future)

#### Layout
- **Purpose**: Wrapper for all pages
- **Structure**:
  - Starfield background (fixed, behind content)
  - Header (sticky)
  - Main content area (with padding)
  - Footer
- **Outlet**: React Router outlet for page content

#### Footer
- **Content**: Copyright, links, social media (future)
- **Styling**: Minimal, space-themed

### Shared Components

#### Starfield
- **Technology**: HTML5 Canvas with JavaScript animation
- **Features**:
  - 200+ twinkling stars (density based on screen size)
  - Random star sizes (1-3.5px)
  - Twinkling animation (sine wave opacity)
  - Shooting stars (2% spawn chance per frame)
  - Gradient trails on shooting stars
  - Responsive to window resize
- **Performance**: RequestAnimationFrame for smooth 60fps
- **Positioning**: Fixed, full-screen, z-index -10

#### UI Components (Shadcn/ui)
- **Button**: Multiple variants (default, outline, ghost, destructive)
- **Card**: Container with header, content, footer sections
- **Input**: Styled text input with label support
- **Label**: Accessible form labels
- **Dialog**: Modal dialogs for forms and confirmations

### Page Components

All page components follow this pattern:
1. Import necessary hooks and components
2. Fetch data with React Query
3. Handle loading and error states
4. Render content with proper styling
5. Handle user interactions

---

## Styling System

### Tailwind Configuration

**Custom Colors**:
```javascript
colors: {
  space: {
    bg: '#0a0e27',
    surface: '#1a1f3a',
    elevated: '#252b4a',
  },
  cosmic: {
    indigo: '#6366f1',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
  },
}
```

**Custom Utilities**:
```css
.glass-effect {
  @apply bg-white/5 backdrop-blur-md border border-white/10;
}

.text-gradient {
  @apply bg-clip-text text-transparent bg-cosmic-gradient;
}

.cosmic-glow {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}
```

**Custom Animations**:
- `float`: Gentle up-down movement (6s loop)
- `glow`: Pulsing glow effect (2s alternate)

### CSS Variables (index.css)

HSL-based color system for Shadcn/ui compatibility:
```css
:root {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --primary: 280 90% 65%;
  --secondary: 189 94% 50%;
  --muted: 217 33% 17%;
  --accent: 330 85% 60%;
  --destructive: 0 84% 60%;
  --radius: 0.5rem;
}
```

---

## Routing Structure

```typescript
<Routes>
  <Route path="/" element={<Layout />}>
    {/* Customer Routes */}
    <Route index element={<HomePage />} />
    <Route path="flights" element={<FlightsPage />} />
    <Route path="book/:flightId" element={<BookingPage />} />
    <Route path="my-bookings" element={<MyBookingsPage />} />
    
    {/* Agent Routes */}
    <Route path="agent" element={<AgentDashboard />} />
    <Route path="agent/bookings" element={<AgentBookingsPage />} />
  </Route>
</Routes>
```

**Navigation Flow**:
- `/` → Landing page
- `/flights` → Browse flights
- `/book/:flightId` → Book specific flight
- `/my-bookings` → View user's bookings
- `/agent` → Agent dashboard
- `/agent/bookings` → Manage all bookings

---

## Error Handling Strategy

### Backend Error Format
```json
{
  "success": false,
  "error": "Human-readable message",
  "error_code": "MACHINE_READABLE_CODE",
  "details": "Specific guidance"
}
```

### Frontend Error Handling

**API Client Interceptor**:
- Catches all API errors
- Logs to console for debugging
- Preserves error structure for components
- Handles network errors separately

**Component-Level Handling**:
- Display error messages in UI
- Use error codes for conditional logic
- Show actionable guidance to users
- Maintain form state on errors

**User-Friendly Messages**:
- `FLIGHT_NOT_FOUND`: "This flight is no longer available"
- `NO_SEATS_AVAILABLE`: "Sorry, this flight is fully booked"
- `USER_NOT_FOUND`: "Please register or check your details"
- `NAME_MISMATCH`: "Name doesn't match your account"
- `EMAIL_EXISTS`: "This email is already registered"
- `BOOKING_NOT_FOUND`: "Booking not found"
- `ALREADY_CANCELLED`: "This booking was already cancelled"

---

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Frontend Setup

1. **Clone repository** (or create new project):
```bash
mkdir bob_demo_frontend
cd bob_demo_frontend
```

2. **Initialize frontend**:
```bash
mkdir frontend
cd frontend
npm create vite@latest . -- --template react-ts
```

3. **Install dependencies**:
```bash
npm install react-router-dom axios @tanstack/react-query zustand
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react framer-motion date-fns clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label @radix-ui/react-select
npm install @radix-ui/react-slot @radix-ui/react-toast
npm install class-variance-authority

npm install -D tailwindcss postcss autoprefixer
npm install -D tailwindcss-animate
npm install -D @types/react @types/react-dom
npm install -D eslint prettier
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

4. **Initialize Tailwind**:
```bash
npx tailwindcss init -p
```

5. **Create environment file**:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8082
VITE_APP_NAME=Galaxium Travels
```

6. **Configure Vite** (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

7. **Configure TypeScript** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

8. **Configure Tailwind** (`tailwind.config.js`):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          bg: '#0a0e27',
          surface: '#1a1f3a',
          elevated: '#252b4a',
        },
        cosmic: {
          indigo: '#6366f1',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to right, #6366f1, #8b5cf6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

9. **Start development server**:
```bash
npm run dev
```

Application runs at `http://localhost:3000`

### Backend Setup

See `python_backend/README.md` for detailed backend setup instructions.

Quick start:
```bash
cd python_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8082
```

---

## Key Implementation Decisions

### 1. Why Vite over Create React App?
- **Faster**: Lightning-fast HMR and build times
- **Modern**: Native ES modules, better tree-shaking
- **Simpler**: Less configuration, cleaner setup
- **Future-proof**: Active development, growing ecosystem

### 2. Why TanStack Query?
- **Caching**: Automatic caching and invalidation
- **Optimistic Updates**: Better UX for mutations
- **Loading States**: Built-in loading and error states
- **Refetching**: Smart refetching strategies
- **DevTools**: Excellent debugging experience

### 3. Why Zustand over Redux?
- **Simplicity**: Minimal boilerplate
- **Size**: Tiny bundle size (~1KB)
- **TypeScript**: Excellent TypeScript support
- **Persistence**: Easy localStorage integration
- **Performance**: No unnecessary re-renders

### 4. Why Shadcn/ui?
- **Customizable**: Copy components, modify as needed
- **Accessible**: Built on Radix UI primitives
- **Unstyled**: Full control over styling
- **Modern**: Uses latest React patterns
- **No Lock-in**: Own the code, not a dependency

### 5. Why Canvas for Starfield?
- **Performance**: Hardware-accelerated rendering
- **Control**: Full control over animation
- **Effects**: Complex effects (shooting stars, glow)
- **Responsive**: Easy to adapt to screen size
- **Smooth**: 60fps animations with requestAnimationFrame

### 6. Why Dark Theme?
- **Space Theme**: Fits the interplanetary travel concept
- **Modern**: Popular in developer tools and apps
- **Contrast**: Better for highlighting important elements
- **Immersive**: Creates atmospheric experience
- **Eye-friendly**: Reduces eye strain

### 7. Why No Authentication?
- **Demo Focus**: Simplified for demonstration
- **Quick Start**: Users can start immediately
- **Agent Testing**: Easy to switch modes
- **Future Enhancement**: Can add JWT auth later

### 8. Why SQLite Backend?
- **Simplicity**: No separate database server
- **Portability**: Single file database
- **Demo-friendly**: Easy to reset and seed
- **Sufficient**: Handles demo load easily
- **Upgradeable**: Can migrate to PostgreSQL later

---

## Responsive Design Strategy

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Single column layouts
- Stacked flight cards
- Touch-friendly buttons (min 44px)
- Simplified navigation
- Bottom sheets for forms

### Tablet Optimizations
- Two-column grids
- Side drawers for filters
- Expanded navigation
- Larger touch targets

### Desktop Optimizations
- Three-column grids
- Sidebar layouts
- Hover effects
- Tooltips
- Full navigation bar

---

## Performance Optimizations

### Code Splitting
- Route-based splitting with React.lazy
- Dynamic imports for heavy components
- Lazy load modals and dialogs

### Bundle Optimization
- Tree shaking (automatic with Vite)
- Minification in production
- Compression (gzip/brotli)
- Code splitting by route

### Caching Strategy
- React Query cache (5 min for flights)
- Browser cache headers
- Service worker (future enhancement)

### Image Optimization
- WebP format with fallbacks
- Lazy loading
- Responsive images with srcset

---

## Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- Form validation
- Utility functions
- Custom hooks

### Integration Tests
- API integration
- User flows
- State management
- Error handling

### E2E Tests (Future)
- Complete booking flow
- Registration process
- Cancellation flow
- Agent workflows

---

## Deployment

### Build Process
```bash
npm run build
# Outputs to dist/ directory
```

### Environment Variables
```env
VITE_API_BASE_URL=https://api.galaxiumtravels.com
VITE_APP_NAME=Galaxium Travels
```

### Hosting Options

**Recommended: Vercel**
1. Connect GitHub repository
2. Configure build settings:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
3. Add environment variables
4. Deploy

**Alternative: Netlify**
- Similar to Vercel
- Drag-and-drop dist folder
- Configure redirects for SPA

**Alternative: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
```

---

## Future Enhancements

### Phase 2 (Authentication & Notifications)
- JWT-based authentication
- Password-protected accounts
- Email notifications for bookings
- Password reset flow
- Email verification

### Phase 3 (Advanced Features)
- Payment integration (Stripe)
- Seat selection interface
- Loyalty program
- Real-time seat updates (WebSocket)
- Multi-language support (i18n)

### Phase 4 (AI & Analytics)
- AI-powered flight recommendations
- Dynamic pricing
- Group bookings
- Travel insurance
- Customer reviews and ratings
- Analytics dashboard

### Phase 5 (Mobile & Offline)
- React Native mobile app
- Offline support with service workers
- Push notifications
- Mobile-specific features
- Progressive Web App (PWA)

---

## Troubleshooting

### Common Issues

**Issue**: API calls failing
- **Solution**: Check backend is running on port 8082
- **Solution**: Verify VITE_API_BASE_URL in .env
- **Solution**: Check CORS settings in backend

**Issue**: Styles not applying
- **Solution**: Restart dev server after Tailwind config changes
- **Solution**: Check Tailwind content paths
- **Solution**: Verify CSS imports in main.tsx

**Issue**: TypeScript errors
- **Solution**: Run `npm install` to ensure all types are installed
- **Solution**: Check tsconfig.json paths configuration
- **Solution**: Restart TypeScript server in VS Code

**Issue**: Build fails
- **Solution**: Clear node_modules and reinstall
- **Solution**: Check for TypeScript errors
- **Solution**: Verify all imports are correct

**Issue**: Starfield not showing
- **Solution**: Check z-index (-10 for background)
- **Solution**: Verify canvas is rendering (check console)
- **Solution**: Check browser canvas support

**Issue**: Booking ID not displaying after booking
- **Root Cause**: Backend wraps responses in `{success: true, data: {...}}` but frontend expected direct data
- **Solution**: API endpoints now extract data using `response.data.data || response.data`
- **Affected Endpoints**: `/book`, `/bookings/{user_id}`, `/cancel/{booking_id}`, `/user_id`
- **Verification**: Check browser console for "Booking created:" log with booking object
- **Fixed In**: `src/api/endpoints.ts` - All mutation endpoints updated

**Issue**: Registration modal not appearing
- **Root Cause**: RegistrationModal component wasn't rendered in the UI
- **Solution**: Added RegistrationModal to HomePage and Header components
- **Verification**: Look for "Register" button on homepage and in header (when not logged in)
- **Fixed In**: `src/pages/customer/HomePage.tsx` and `src/components/layout/Header.tsx`

---

## Development Workflow

### Daily Development
1. Start backend: `cd python_backend && uvicorn app.main:app --reload --port 8082`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:3000`
4. Make changes (hot reload automatic)
5. Test in browser
6. Commit changes

### Adding New Features
1. Create feature branch
2. Implement backend changes first
3. Update API types in frontend
4. Create/update components
5. Add to routing if needed
6. Test thoroughly
7. Update documentation
8. Create pull request

### Code Quality Checks
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Format code
npx prettier --write .

# Run tests
npm run test
```

---

## Documentation Files

### Existing Documentation
- `frontend/README.md` - Frontend overview and setup
- `frontend/FRONTEND_SPECIFICATION.md` - Detailed technical specification
- `python_backend/README.md` - Backend setup and API docs
- `python_backend/SPEC_SHEET.md` - Backend requirements
- `python_backend/PROJECT_SUMMARY.md` - Backend implementation summary

### This Document
- **Purpose**: Complete reproduction guide
- **Audience**: Developers starting from scratch
- **Scope**: Everything needed to rebuild the project
- **Maintenance**: Update when making architectural changes

---

## Success Metrics

### Technical Metrics
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle size < 500KB (gzipped)
- 100% TypeScript coverage
- Zero console errors

### User Experience Metrics
- Booking completion rate > 80%
- Error rate < 5%
- Average booking time < 2 minutes
- Mobile usability score > 85
- Accessibility score > 90

---

## Credits & License

**Created by**: Bob (AI Assistant)  
**License**: MIT License  
**Purpose**: Educational demonstration project  
**Status**: Production-ready demo

---

## Appendix: Complete File Listings

### Key Configuration Files

**package.json** - See file for complete dependencies list

**vite.config.ts** - Vite configuration with path aliases and proxy

**tailwind.config.js** - Custom Tailwind theme with space colors

**tsconfig.json** - TypeScript configuration with strict mode

**.env.example** - Environment variables template

### Key Source Files

**src/main.tsx** - Application entry point

**src/App.tsx** - Main app component with routing

**src/index.css** - Global styles and Tailwind directives

**src/types/index.ts** - TypeScript type definitions

**src/store/userStore.ts** - Zustand user state management

**src/api/client.ts** - Axios instance configuration

**src/api/endpoints.ts** - API endpoint definitions

**src/lib/queryClient.ts** - React Query configuration

**src/components/layout/Layout.tsx** - Main layout wrapper

**src/components/layout/Header.tsx** - Navigation header

**src/components/shared/Starfield.tsx** - Animated background

**src/pages/customer/HomePage.tsx** - Landing page

**src/pages/customer/FlightsPage.tsx** - Browse flights

**src/pages/customer/BookingPage.tsx** - Book a flight

**src/pages/customer/MyBookingsPage.tsx** - View bookings

**src/pages/agent/AgentDashboard.tsx** - Agent main page

**src/pages/agent/AgentBookingsPage.tsx** - Manage bookings

---

## Quick Start Commands

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd python_backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8082

# Build for production
cd frontend
npm run build

# Run tests
npm run test
```

---

**End of Documentation**

This guide contains everything needed to reproduce the Galaxium Travels project from scratch. Follow the setup instructions, implement the components as described, and refer to the design system for styling consistency.