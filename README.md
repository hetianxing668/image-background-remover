# BG Remover

> AI-powered online image background removal tool.

## Features

- 🖼️ Upload any JPG, PNG, or WebP image
- ✨ One-click AI background removal
- 📥 Download transparent PNG
- 📱 Fully responsive, works on mobile
- 🔒 No signup required

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Background Removal**: [Remove.bg API](https://www.remove.bg/api)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- A [Remove.bg](https://www.remove.bg/api) API key (free tier: 50 requests/month)

### Installation

```bash
# Clone the repository
git clone https://github.com/hetianxing668/image-background-remover.git
cd image-background-remover

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Remove.bg API key to .env.local
# REMOVE_BG_API_KEY=your_api_key_here

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start.

## Usage

1. Open the app in your browser
2. Upload or drag-and-drop an image
3. Enter your Remove.bg API key (first time only)
4. Click "Remove Background"
5. Download the result as transparent PNG

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variable `REMOVE_BG_API_KEY`
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js.

## License

MIT
