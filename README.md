# Voice Dictation

Customizable AI powered voice dictation tool. Open-source alternative to [Wispr Flow](https://wisprflow.ai) and [SuperWhisper](https://superwhisper.com). Speak and your words are typed wherever your cursor is.

## Why Voice Dictation?

Unlike proprietary voice dictation tools, this project gives you full control:

- **Swap AI providers** — Use any STT (Cartesia, Deepgram, Whisper) or LLM (Cerebras, OpenAI, local models)
- **Customize processing** — Modify prompts, add custom processors, or chain multiple LLMs
- **Extensible** — Built on [Pipecat](https://github.com/pipecat-ai/pipecat)'s modular pipeline framework

## Features

- **Dual-Mode Recording**
  - Hold-to-record: `Ctrl+Alt+.` - Hold to record, release to stop
  - Start and stop: `Ctrl+Alt+Space` - Press to start, press again to stop
- **Real-time Speech-to-Text** - Fast transcription with Cartesia Ink-Whisper
- **LLM Text Cleanup** - Removes filler words, fixes grammar using Cerebras
- **Automatic Text Typing** - Pastes cleaned text at cursor position
- **System Tray Integration** - Click to show/hide, right-click menu

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Tauri App (app/)                       │
│  - Global hotkeys (Ctrl+Alt+Space, Ctrl+Alt+.)             │
│  - Rust backend with enigo/arboard for text typing         │
│  - React frontend with Pipecat client                      │
│  - System tray with show/hide toggle                       │
└─────────────────────────┬───────────────────────────────────┘
                          │ WebSocket (ws://localhost:8765)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Dictation Server (server/)                  │
│  - Pipecat pipeline for audio processing                    │
│  - Cartesia STT (speech-to-text)                            │
│  - Cerebras LLM (text cleanup)                              │
│  - Returns cleaned text to client                           │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Rust (for Tauri)
- Node.js 18+
- pnpm
- Python 3.10+
- uv (Python package manager)

### Linux Dependencies

```bash
sudo apt-get install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev libgtk-3-dev
```

## Quick Start

### 1. Get API Keys

Sign up and get API keys from:
- **Cartesia**: https://cartesia.ai (STT)
- **Cerebras**: https://cloud.cerebras.ai (LLM - free tier: 1M tokens/day)

### 2. Set Up the Server

```bash
cd server

# Copy environment template
cp .env.example .env

# Add your API keys to .env
vim .env

# Install dependencies
uv sync

# Start the server
uv run python dictation_server.py
```

### 3. Set Up the App

```bash
cd app

# Install dependencies
pnpm install

# Start development mode
pnpm dev
```

### 4. Use It

1. Start the server first (`uv run python dictation_server.py`)
2. Start the app (`pnpm dev`)
3. Use either shortcut:
   - **Toggle**: Press `Ctrl+Alt+Space` to start, press again to stop
   - **Hold**: Hold `Ctrl+Alt+.` while speaking, release to stop
4. Your cleaned text is typed at your cursor

## Project Structure

```
voice-dictation/
├── server/                     # Python dictation server
│   ├── dictation_server.py     # WebSocket server entry point
│   ├── config/
│   │   └── settings.py         # Pydantic settings configuration
│   ├── processors/
│   │   ├── llm_cleanup.py      # LLM text cleanup processor
│   │   └── transcription_buffer.py
│   ├── services/
│   │   ├── llm_service.py      # Cerebras LLM service
│   │   └── stt_service.py      # Cartesia STT service
│   ├── utils/
│   │   └── logger.py
│   ├── pyproject.toml
│   └── .env.example
├── app/                        # Tauri desktop app
│   ├── src/                    # React frontend
│   │   ├── App.tsx
│   │   ├── OverlayApp.tsx
│   │   └── lib/
│   │       └── tauri.ts        # Tauri API wrapper
│   ├── src-tauri/              # Rust backend
│   │   ├── src/
│   │   │   ├── lib.rs          # Main setup, shortcuts, tray
│   │   │   ├── state.rs        # App state
│   │   │   └── commands/
│   │   │       └── text.rs     # type_text command
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Server Commands

```bash
cd server

# Start server (default: localhost:8765)
uv run python dictation_server.py

# Start with custom host/port
uv run python dictation_server.py --host 0.0.0.0 --port 9000

# Enable verbose logging
uv run python dictation_server.py --verbose
```

## App Commands

```bash
cd app

# Development
pnpm dev           # Start Tauri app in dev mode
pnpm dev:vite      # Start Vite dev server only
pnpm lint          # Lint and format code (Biome)
pnpm typecheck     # Run TypeScript type checking
pnpm check         # Run lint + typecheck

# Production Build
pnpm build         # Build for current platform
```

## Configuration

### Server Configuration (.env)

| Variable           | Description              | Default  |
| ------------------ | ------------------------ | -------- |
| `CARTESIA_API_KEY` | Cartesia API key for STT | Required |
| `CEREBRAS_API_KEY` | Cerebras API key for LLM | Required |
| `LOG_LEVEL`        | Logging level            | `INFO`   |

### App Configuration

The app connects to `ws://localhost:8765` by default. The server URL is configured in `src-tauri/src/commands/text.rs`.

## Technology Stack

- **App**: Tauri v2, Rust, React, TypeScript, Tailwind CSS
- **Server**: Python, Pipecat, Cartesia (STT), Cerebras (LLM)
- **Communication**: WebSocket with Protobuf serialization

## Acknowledgments

This project is powered by [Pipecat](https://github.com/pipecat-ai/pipecat), an open-source framework for building voice and multimodal AI pipelines. Pipecat's modular architecture makes it easy to swap STT providers, LLMs, and add custom processing stages—enabling the customizability that sets this project apart from proprietary alternatives.

## License

[AGPL-3.0](LICENSE)
