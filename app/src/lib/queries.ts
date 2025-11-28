import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useServerUrl() {
	return useQuery({
		queryKey: ["serverUrl"],
		queryFn: () => invoke<string>("get_server_url"),
		staleTime: Number.POSITIVE_INFINITY,
	});
}

export function useTypeText() {
	return useMutation({
		mutationFn: (text: string) => invoke("type_text", { text }),
	});
}
