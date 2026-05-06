import { useContext } from 'react';
import { TabContext } from '../context/TabContext.tsx'

export function useTab() {
	const context = useContext(TabContext);
	if (!context) {
		throw new Error("useTab must be used inside TabProvider");
	}
	return context;
}
