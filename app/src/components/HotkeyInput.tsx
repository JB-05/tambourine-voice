import { useDisclosure } from "@mantine/hooks";
import { useCallback } from "react";
import type { HotkeyConfig } from "../lib/tauri";

interface HotkeyInputProps {
	label: string;
	description?: string;
	value: HotkeyConfig;
	onChange: (config: HotkeyConfig) => void;
	disabled?: boolean;
}

function parseKeyEvent(event: KeyboardEvent): HotkeyConfig | null {
	const modifiers: string[] = [];

	if (event.ctrlKey) modifiers.push("ctrl");
	if (event.altKey) modifiers.push("alt");
	if (event.shiftKey) modifiers.push("shift");
	if (event.metaKey) modifiers.push("meta");

	// Get the key name
	const key = event.code
		.replace("Key", "")
		.replace("Digit", "")
		.replace("Numpad", "Numpad");

	// Don't capture modifier-only keypresses
	if (["Control", "Alt", "Shift", "Meta"].includes(event.key)) {
		return null;
	}

	// Require at least one modifier
	if (modifiers.length === 0) {
		return null;
	}

	return { modifiers, key };
}

export function HotkeyInput({
	label,
	description,
	value,
	onChange,
	disabled,
}: HotkeyInputProps) {
	const [isCapturing, { open: startCapture, close: stopCapture }] =
		useDisclosure(false);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (!isCapturing) return;

			event.preventDefault();
			event.stopPropagation();

			const config = parseKeyEvent(event.nativeEvent);
			if (config) {
				onChange(config);
				stopCapture();
			}
		},
		[isCapturing, onChange, stopCapture],
	);

	const handleBlur = useCallback(() => {
		stopCapture();
	}, [stopCapture]);

	const handleClick = useCallback(() => {
		if (!disabled) {
			startCapture();
		}
	}, [disabled, startCapture]);

	const formatKey = (key: string) => {
		return key.charAt(0).toUpperCase() + key.slice(1);
	};

	return (
		<div>
			<p className="settings-label">{label}</p>
			{description && <p className="settings-description">{description}</p>}
			<button
				type="button"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				disabled={disabled}
				className={`hotkey-display ${isCapturing ? "capturing" : ""}`}
				style={{
					width: "100%",
					marginTop: 8,
					cursor: disabled ? "not-allowed" : "pointer",
					opacity: disabled ? 0.5 : 1,
				}}
			>
				{isCapturing ? (
					<span style={{ color: "var(--accent-primary)", fontSize: 14 }}>
						Press a key combination...
					</span>
				) : (
					<>
						{value.modifiers.concat([value.key]).map((part) => (
							<span key={part} className="badge">
								{formatKey(part)}
							</span>
						))}
						<span className="hotkey-hint">Click to change</span>
					</>
				)}
			</button>
		</div>
	);
}
