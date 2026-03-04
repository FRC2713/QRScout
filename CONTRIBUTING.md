# Contributing to QRScout

Thanks for your interest in contributing to QRScout! This guide will help you get set up for local development.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/FRC2713/QRScout.git
cd QRScout
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and add your Blue Alliance API key:

```
VITE_TBA_API_KEY=your_api_key_here
```

To get a TBA API key:
1. Go to [The Blue Alliance](https://www.thebluealliance.com/account)
2. Sign in or create an account
3. Navigate to **More** > **Account** > **Read API Keys**
4. Create a new key and copy it to your `.env` file

> **Note:** The API key is only required if you're working on features that use The Blue Alliance integration. Other features will work without it.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/QRScout/`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run schema` | Generate JSON schema |

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: 2 space indent, 80 char width, single quotes
- **Components**: Functional components with TypeScript interfaces
- **State Management**: Zustand with immer for immutable updates
- **Styling**: Tailwind CSS with `cn` utility for class merging

## Project Structure

```
src/
  components/     # React components
    ui/           # Reusable UI components (shadcn/ui)
  store/          # Zustand state management
  types/          # TypeScript type definitions
  lib/            # Utility libraries
  util/           # Helper utilities
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Test locally with `npm run build` to ensure it compiles
5. Commit your changes with a descriptive message
6. Push to your fork and open a Pull Request

## Questions?

Open an issue on the [GitHub repository](https://github.com/FRC2713/QRScout/issues) if you have questions or run into problems.
