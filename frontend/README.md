# Galaxium Travels - Frontend

A modern React frontend for the Galaxium Travels interplanetary flight booking system.

## 🚀 Features

- **Customer Mode**
  - Browse available flights to various planets
  - Book flights with real-time seat availability
  - View and manage personal bookings
  - Cancel bookings with automatic seat restoration

- **Agent Mode**
  - Agent dashboard with system overview
  - View all bookings across customers
  - Manage bookings on behalf of customers

- **Visual Design**
  - Animated starfield background with shooting stars
  - Dark space theme with cosmic color palette
  - Glassmorphic UI components
  - Smooth animations and transitions
  - Fully responsive design

## 🛠️ Tech Stack

- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool and dev server
- **React Router 6.20** - Client-side routing
- **TanStack Query 5.12** - Server state management
- **Zustand 4.4** - Client state management
- **Tailwind CSS 3.3** - Utility-first styling
- **Shadcn/ui** - Accessible component library
- **Axios 1.6** - HTTP client
- **Lucide React** - Icon library

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8082
VITE_APP_NAME=Galaxium Travels
```

### Backend Connection

The frontend expects the backend API to be running on `http://localhost:8082`. Make sure the Python backend is running before starting the frontend.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components (Shadcn)
│   │   ├── layout/      # Layout components
│   │   ├── customer/    # Customer-specific components
│   │   ├── agent/       # Agent-specific components
│   │   └── shared/      # Shared components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── customer/    # Customer pages
│   │   └── agent/       # Agent pages
│   ├── store/           # Zustand stores
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Design System

### Color Palette

- **Background**: `#0a0e27` (Deep space blue)
- **Surface**: `#1a1f3a` (Dark blue-gray)
- **Cosmic Indigo**: `#6366f1` (Primary actions)
- **Cosmic Purple**: `#8b5cf6` (Secondary elements)
- **Cosmic Cyan**: `#06b6d4` (Highlights)

### Typography

- **Body**: Inter
- **Headings**: Space Grotesk
- **Monospace**: JetBrains Mono

## 🚦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 API Integration

The frontend communicates with the backend through the following endpoints:

- `GET /health` - Health check
- `POST /register` - User registration
- `GET /user_id` - User lookup
- `GET /flights` - List all flights
- `POST /book` - Create booking
- `GET /bookings/:userId` - Get user bookings
- `POST /cancel/:bookingId` - Cancel booking

## 🔐 State Management

### Client State (Zustand)

- User authentication state
- Agent/Customer mode toggle
- Persisted to localStorage

### Server State (TanStack Query)

- Flight data caching (5 min stale time)
- Booking data caching (1 min stale time)
- Automatic refetching on window focus
- Optimistic updates for mutations

## 🎯 Key Features Implementation

### Starfield Background

Animated canvas-based starfield with:
- 200+ twinkling stars
- Random shooting stars
- Smooth 60fps animations
- Responsive to window resize

### Flight Booking Flow

1. Browse flights on `/flights`
2. Click "Book Now" on desired flight
3. Confirm passenger details
4. Complete booking
5. View confirmation with booking ID

### Booking Management

- View all personal bookings
- Cancel bookings (only "booked" status)
- Real-time seat availability updates
- Status badges (booked, cancelled, completed)

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use, Vite will automatically use the next available port (3001, 3002, etc.)

### API Connection Issues

1. Verify backend is running on port 8082
2. Check `VITE_API_BASE_URL` in `.env`
3. Ensure CORS is properly configured in backend

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## 📝 Development Notes

- The application uses React Router for client-side routing
- All API calls are proxied through Vite dev server
- TypeScript strict mode is enabled
- ESLint and Prettier are configured for code quality

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel

1. Connect your GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables
5. Deploy

## 📄 License

MIT License - Created for demonstration purposes

## 🤝 Contributing

This is a demo project. Feel free to fork and modify for your own use.

---

**Built with ❤️ using React, TypeScript, and Vite**