import './App.css';
import { useTab } from './hooks/useTab.tsx'
import { Chat } from './components/chat/Chat.tsx';
import { MemoryManager } from './components/memory/MemoryManager.tsx';
import TabSwitcher from './components/TabSwitcher.tsx';
import { Copybox } from './components/copy/CopyBox.tsx';

function App() {
	const tabContext = useTab();
	return (
		<div className="app">
			<header>
				<TabSwitcher />
			</header>
			{tabContext.tab === "chat" ? <Chat /> : <MemoryManager />}
			{tabContext.tab === "chat" ? <Copybox /> : <></>}
		</div>
	)
}

export default App
