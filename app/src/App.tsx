import { Switch } from "@mantine/core";
import { AlertCircle, Home, Mic, Settings } from "lucide-react";
import { useState } from "react";
import { DeviceSelector } from "./components/DeviceSelector";
import { HistoryFeed } from "./components/HistoryFeed";
import { HotkeyInput } from "./components/HotkeyInput";
import {
	useSettings,
	useUpdateHoldHotkey,
	useUpdateSoundEnabled,
	useUpdateToggleHotkey,
} from "./lib/queries";
import type { HotkeyConfig } from "./lib/tauri";
import "./styles.css";

type View = "home" | "settings";

function Sidebar({
	activeView,
	onViewChange,
}: {
	activeView: View;
	onViewChange: (view: View) => void;
}) {
	return (
		<aside className="sidebar">
			<header className="sidebar-header">
				<div className="sidebar-logo">
					<div className="sidebar-logo-icon">
						<Mic size={16} />
					</div>
					<span className="sidebar-title">Voice</span>
				</div>
			</header>

			<nav className="sidebar-nav">
				<button
					type="button"
					className={`nav-item ${activeView === "home" ? "active" : ""}`}
					onClick={() => onViewChange("home")}
				>
					<Home size={18} className="nav-icon" />
					<span>Home</span>
				</button>

				<button
					type="button"
					className={`nav-item ${activeView === "settings" ? "active" : ""}`}
					onClick={() => onViewChange("settings")}
				>
					<Settings size={18} className="nav-icon" />
					<span>Settings</span>
				</button>
			</nav>

			<footer className="sidebar-footer">
				<p className="sidebar-footer-text">v1.0.0</p>
			</footer>
		</aside>
	);
}

function InstructionsCard() {
	const { data: settings } = useSettings();

	const toggleHotkey = settings?.toggle_hotkey ?? {
		modifiers: ["ctrl", "alt"],
		key: "Space",
	};

	const formatHotkey = (config: HotkeyConfig) => {
		const parts = [
			...config.modifiers.map((m) => m.charAt(0).toUpperCase() + m.slice(1)),
			config.key,
		];
		return parts;
	};

	const hotkeyParts = formatHotkey(toggleHotkey);

	return (
		<div className="instructions-card animate-in">
			<h2 className="instructions-card-title">
				Hold{" "}
				<span className="kbd-combo">
					{hotkeyParts.map((part, index) => (
						<span key={part}>
							<span className="kbd">{part}</span>
							{index < hotkeyParts.length - 1 && (
								<span className="kbd-plus">+</span>
							)}
						</span>
					))}
				</span>{" "}
				to <span className="highlight">dictate</span>
			</h2>
			<p className="instructions-card-text">
				Press the hotkey to start recording. Speak clearly, and your words will
				be typed wherever your cursor is. The overlay appears in the
				bottom-right corner of your screen.
			</p>
			<p className="instructions-card-hint">
				<Mic size={14} />
				<span>Click the overlay microphone button to toggle recording</span>
			</p>
		</div>
	);
}

function HomeView() {
	return (
		<div className="main-content">
			<header className="page-header animate-in">
				<h1 className="page-title">Welcome back</h1>
				<p className="page-subtitle">Your voice dictation history</p>
			</header>

			<InstructionsCard />

			<HistoryFeed />
		</div>
	);
}

function SettingsView() {
	const { data: settings, isLoading } = useSettings();
	const updateSoundEnabled = useUpdateSoundEnabled();
	const updateToggleHotkey = useUpdateToggleHotkey();
	const updateHoldHotkey = useUpdateHoldHotkey();

	const handleSoundToggle = (checked: boolean) => {
		updateSoundEnabled.mutate(checked);
	};

	const handleToggleHotkeyChange = (config: HotkeyConfig) => {
		updateToggleHotkey.mutate(config);
	};

	const handleHoldHotkeyChange = (config: HotkeyConfig) => {
		updateHoldHotkey.mutate(config);
	};

	const defaultToggleHotkey: HotkeyConfig = {
		modifiers: ["ctrl", "alt"],
		key: "Space",
	};

	const defaultHoldHotkey: HotkeyConfig = {
		modifiers: ["ctrl", "alt"],
		key: "Period",
	};

	return (
		<div className="main-content">
			<header className="page-header animate-in">
				<h1 className="page-title">Settings</h1>
				<p className="page-subtitle">
					Configure your voice dictation preferences
				</p>
			</header>

			<div className="settings-section animate-in animate-in-delay-1">
				<h3 className="settings-section-title">Audio</h3>
				<div className="settings-card">
					<DeviceSelector />
					<div className="settings-row" style={{ marginTop: 16 }}>
						<div>
							<p className="settings-label">Sound feedback</p>
							<p className="settings-description">
								Play sounds when recording starts and stops
							</p>
						</div>
						<Switch
							checked={settings?.sound_enabled ?? true}
							onChange={(event) =>
								handleSoundToggle(event.currentTarget.checked)
							}
							disabled={isLoading}
							color="orange"
							size="md"
						/>
					</div>
				</div>
			</div>

			<div className="settings-section animate-in animate-in-delay-2">
				<h3 className="settings-section-title">Hotkeys</h3>
				<div className="settings-card">
					<HotkeyInput
						label="Toggle Recording"
						description="Press once to start recording, press again to stop"
						value={settings?.toggle_hotkey ?? defaultToggleHotkey}
						onChange={handleToggleHotkeyChange}
						disabled={isLoading}
					/>

					<div style={{ marginTop: 20 }}>
						<HotkeyInput
							label="Hold to Record"
							description="Hold to record, release to stop"
							value={settings?.hold_hotkey ?? defaultHoldHotkey}
							onChange={handleHoldHotkeyChange}
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="note" style={{ marginTop: 16 }}>
					<AlertCircle size={16} className="note-icon" />
					<span>Hotkey changes require app restart to take effect.</span>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	const [activeView, setActiveView] = useState<View>("home");

	return (
		<div className="app-layout">
			<Sidebar activeView={activeView} onViewChange={setActiveView} />
			{activeView === "home" ? <HomeView /> : <SettingsView />}
		</div>
	);
}
