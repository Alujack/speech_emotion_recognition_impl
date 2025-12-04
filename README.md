# Speech Emotion Recognition - Frontend

A modern, responsive web application for analyzing emotions in speech using AI. Built with Next.js, React, and TypeScript.

> **Note:** This is a separate repository from the backend. The FastAPI backend is maintained in a different repository.

## Features

- 🎤 **Audio Upload Interface** - Drag-and-drop or file selection
- 📊 **Real-time Emotion Analysis** - Get instant results
- 🎨 **Beautiful UI** - Modern gradient design with dark mode support
- 📈 **Emotion Visualization** - Interactive charts and progress bars
- 🔊 **Audio Feature Display** - View pitch, tempo, energy, and more
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Screenshots

The app features:
- Beautiful gradient background
- Drag-and-drop audio upload
- Emotion breakdown with color-coded bars
- Audio feature cards
- Demo mode for testing without files

## Prerequisites

- Node.js 18+ or higher
- npm, yarn, pnpm, or bun
- Backend API running (see backend repository)

## Installation

1. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Configure environment** (optional):

   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   If not set, defaults to `http://localhost:8000`.

## Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Start the Backend**: Make sure the FastAPI backend is running on port 8000
2. **Upload Audio**: Drag and drop an audio file or click to select
3. **Analyze**: Click "Analyze Emotion" to get results
4. **View Results**: See emotion breakdown, confidence scores, and audio features
5. **Try Demo**: Click "Try Demo" to see sample results without uploading

## Supported Audio Formats

- WAV (.wav)
- MP3 (.mp3)
- OGG (.ogg)
- WebM (.webm)
- M4A (.m4a)

Max file size: 10MB

## Project Structure

```
speech_emotion_recognition_impl/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Global styles
│   └── favicon.ico       # Favicon
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
├── next.config.ts        # Next.js config
└── README.md            # This file
```

## API Integration

The frontend communicates with the backend API:

```typescript
// Upload and analyze
const formData = new FormData();
formData.append('file', audioFile);
const response = await fetch(`${API_URL}/api/analyze`, {
  method: 'POST',
  body: formData,
});

// Demo mode
const response = await fetch(`${API_URL}/api/analyze/demo`);
```

## Customization

### Styling

The app uses Tailwind CSS. Modify styles in:
- `app/globals.css` - Global styles
- `app/page.tsx` - Component-level styles

### Colors

Emotion colors are defined in the backend response. Each emotion has:
- Color code (hex)
- Emoji
- Label

### Layout

Edit `app/layout.tsx` to change:
- Page title
- Meta description
- Fonts

## Building for Production

```bash
npm run build
npm start
```

This creates an optimized production build.

## Deployment

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
4. Deploy

### Option 2: Other Platforms

Deploy to:
- **Netlify**: Next.js support with SSR
- **Railway**: Easy deployment
- **AWS Amplify**: Full-stack hosting
- **DigitalOcean App Platform**: Container-based

### Important

After deploying, update:
1. **Backend**: Add frontend URL to CORS allowed origins
2. **Frontend**: Set `NEXT_PUBLIC_API_URL` to your backend URL

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Development

### Adding Features

1. Edit `app/page.tsx` for UI changes
2. Update TypeScript interfaces for new API responses
3. Test with both real backend and demo mode

### Debugging

- Check browser console for errors
- Verify backend is running
- Check network tab for API calls
- Ensure CORS is configured correctly

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: React 19
- **Fonts**: Geist Sans & Geist Mono

## Troubleshooting

### Cannot connect to backend

- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS is enabled in backend

### File upload fails

- Check file format (must be audio)
- Verify file size (max 10MB)
- Check backend logs for errors

### Styles not loading

- Run `npm install` to ensure Tailwind is installed
- Check `globals.css` is imported in `layout.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Related Repositories

- Backend API: [Link to backend repository]

## Support

For issues or questions, please open an issue in the repository.
