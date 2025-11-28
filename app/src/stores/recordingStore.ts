import type { PipecatClient } from "@pipecat-ai/client-js";
import { create } from "zustand";

interface RecordingState {
	isRecording: boolean;
	isWaitingForResponse: boolean;
	client: PipecatClient | null;

	setRecording: (value: boolean) => void;
	setWaitingForResponse: (value: boolean) => void;
	setClient: (client: PipecatClient | null) => void;
	reset: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
	isRecording: false,
	isWaitingForResponse: false,
	client: null,

	setRecording: (isRecording) => set({ isRecording }),
	setWaitingForResponse: (isWaitingForResponse) =>
		set({ isWaitingForResponse }),
	setClient: (client) => set({ client }),
	reset: () => set({ isRecording: false, isWaitingForResponse: false }),
}));
