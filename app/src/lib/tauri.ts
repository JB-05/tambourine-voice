import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export type OverlayState = "idle" | "recording";

export interface TypeTextResult {
	success: boolean;
	error?: string;
}

export const tauriAPI = {
	async typeText(text: string): Promise<TypeTextResult> {
		try {
			await invoke("type_text", { text });
			return { success: true };
		} catch (error) {
			return { success: false, error: String(error) };
		}
	},

	async getServerUrl(): Promise<string> {
		return invoke("get_server_url");
	},

	async onStartRecording(callback: () => void): Promise<UnlistenFn> {
		return listen("recording-start", callback);
	},

	async onStopRecording(callback: () => void): Promise<UnlistenFn> {
		return listen("recording-stop", callback);
	},

	setOverlayState(state: OverlayState): void {
		// Control overlay visibility based on state
		const overlayWindow = getCurrentWebviewWindow();
		if (state === "idle") {
			// Hide overlay after a short delay
			setTimeout(() => {
				overlayWindow.hide().catch(console.error);
			}, 1000);
		}
	},
};
