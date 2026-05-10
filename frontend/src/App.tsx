import './App.css';
import { useTab } from './hooks/useTab.tsx'
import Chat from './components/Chat.tsx';
import { MemoryManager } from './components/MemoryManager.tsx';
import TabSwitcher from './components/TabSwitcher.tsx';

function App() {
	const tabContext = useTab();
	return (
		<>
			<TabSwitcher />
			{tabContext.tab === "chat" ? <Chat /> : <MemoryManager />}
		</>
	)
}

export default App
