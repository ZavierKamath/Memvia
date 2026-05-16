import './App.css';
import { useTab } from './hooks/useTab.tsx'
import { Chat } from './components/chat/Chat.tsx';
import { MemoryManager } from './components/memory/MemoryManager.tsx';
import TabSwitcher from './components/TabSwitcher.tsx';

function App() {
	const tabContext = useTab();
	return (
		<>
			<header>
				<h1>
					{tabContext.tab === "chat" ? "Chat" : "Memory Manager"}
				</h1>
				<TabSwitcher />
			</header>
			{tabContext.tab === "chat" ? <Chat /> : <MemoryManager />}
		</>
	)
}

export default App
