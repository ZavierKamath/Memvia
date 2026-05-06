import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type TabType = "chat" | "memories";

export type TabContextType = {
	tab: TabType;
	switchTab: () => void;
}

export const TabContext = createContext<TabContextType | null>(null)

export function TabProvider({ children }: { children: ReactNode }) {
	const [tab, setTab] = useState<TabType>("chat");

	function switchTab() {
		const newTabValue: TabType = tab === "chat" ? "memories" : "chat"
		setTab(newTabValue)
	}

	return (
		<TabContext.Provider value={{ tab, switchTab }}>
			{children}
		</TabContext.Provider>
	)
}
