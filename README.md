# AWAAZ

### Your voice, translated into action.

An AI-powered civic complaint platform that turns spoken Urdu complaints into structured, actionable complaints routed to the appropriate government department.

---

## Problem

Citizens in Pakistan face significant barriers when reporting civic issues:
- Language barriers with formal complaint systems
- Uncertainty about which department handles their issue
- Time-consuming paperwork
- Lack of tracking and follow-up

## Solution

Awaaz allows citizens to speak their complaint naturally in Urdu. AI (Qwen) then:
1. Transcribes the speech
2. Identifies the complaint category
3. Suggests the responsible department with confidence
4. Detects missing information and asks targeted follow-ups
5. Generates a formal complaint and WhatsApp-ready message

## Features

- 🎙️ **Voice-first**: Record complaints in Urdu, no typing needed
- 🧠 **AI Analysis**: Qwen AI understands and structures complaints
- 🏢 **Smart Routing**: Suggests departments with confidence scores
- ❓ **Missing Info Detection**: Asks only for what's needed
- 📝 **Dual Output**: Formal complaint + WhatsApp-ready message
- ✏️ **Editable**: Users can modify AI-generated content
- 💾 **History**: Save and track complaints
- 📊 **Dashboard**: Civic intelligence with aggregate data
- 🌓 **Dark/Light Mode**: Premium themes with persistence
- 📱 **Mobile-first**: Optimized for phone usage
- ♿ **Accessible**: Keyboard navigation, ARIA labels, reduced motion
- 🎭 **Demo Mode**: Works without API keys for demonstrations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6
- **Validation**: Zod
- **AI**: Qwen3-Omni (via configurable provider)
- **Storage**: localStorage (production: MongoDB)

## Architecture

```
src/
├── App.tsx              # Root with routing + theme
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── Report.tsx       # Voice recording + processing
│   ├── Result.tsx       # Analysis + generated complaints
│   ├── History.tsx      # Saved complaints list
│   ├── Dashboard.tsx    # Civic intelligence
│   └── Demo.tsx         # Demo scenarios
├── components/
│   └── Navbar.tsx       # Navigation + theme toggle
├── lib/
│   ├── ai/
│   │   └── provider.ts  # AI abstraction (Qwen + Demo)
│   ├── categories.ts    # Complaint categories config
│   ├── departments.ts   # Department routing config
│   ├── demo.ts          # Demo scenarios data
│   └── storage.ts       # Persistence layer
├── types/
│   └── complaint.ts     # Shared TypeScript types
└── index.css            # Design system + theme
```

## Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Demo Mode

Without API keys, Awaaz runs in **Demo Mode** with:
- Sample audio transcription
- Pre-built analysis responses
- Three demo scenarios (Streetlight, Water, Electricity)
- Clearly labeled demo indicator

To use live AI, configure in `.env.local`:
```
VITE_QWEN_API_KEY=your-key
VITE_QWEN_API_URL=https://your-endpoint
```

## Demo Scenarios

1. **Streetlight**: "Hamari gali mein teen hafton se street light kharab hai..."
2. **Water**: "Hamare ilaqe mein do din se pani nahi aa raha."
3. **Electricity**: "Kal se hamare ilaqe mein bijli ka masla hai..."

## Design Principles

- **Urdu-first**: Proper RTL support, Nastaliq font
- **Trust & Transparency**: Confidence scores, editability, clear AI attribution
- **Mobile-first**: Thumb-friendly controls, readable text
- **Premium feel**: Inspired by Linear, Stripe, Vercel aesthetics
- **Accessibility**: WCAG-compliant focus states, keyboard navigation

## Limitations

- Audio transcription requires Qwen API configuration
- Department routing is suggestive, not authoritative
- No actual government submission (by design)
- localStorage has size limits (use MongoDB for production)

## Future Roadmap

- [ ] MongoDB integration for persistent storage
- [ ] Real government API integrations
- [ ] Push notifications for complaint updates
- [ ] Multi-language support (Punjabi, Sindhi, Pashto)
- [ ] Geolocation-based department routing
- [ ] Community complaint aggregation
- [ ] PWA offline support

## License

Built for hackathon demonstration.
