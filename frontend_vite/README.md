# Spam Email Detection - Frontend

Modern, responsive frontend for the Spam Email Detection application built with React and Vite.

## Features

- Single email spam detection
- Batch email analysis
- MBOX file processing
- Real-time results with confidence scores
- Pattern detection visualization

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see main README)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure the backend API URL:
- **Local development**: `VITE_API_URL=http://localhost:8000`
- **Production**: Set this in Vercel dashboard

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Deployment to Vercel

See the main [DEPLOYMENT.md](../DEPLOYMENT.md) file for complete deployment instructions.

### Quick Deploy

1. Push code to GitHub
2. Import project in Vercel
3. Set Root Directory to `frontend_vite`
4. Set `VITE_API_URL` environment variable
5. Deploy!

## Project Structure

```
frontend_vite/
├── src/
│   ├── components/      # React components
│   ├── services/        # API service layer
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── vercel.json         # Vercel configuration
└── vite.config.js      # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Radix UI** - Component primitives
- **Framer Motion** - Animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
