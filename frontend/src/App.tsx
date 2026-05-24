import { useTab } from './hooks/useTab.tsx'
import { Chat } from './components/chat/Chat.tsx';
import { MemoryManager } from './components/memory/MemoryManager.tsx';
import TabSwitcher from './components/TabSwitcher.tsx';
import { Copybox } from './components/copy/CopyBox.tsx';

function App() {
	const tabContext = useTab();
	return (
		<div className="flex flex-col justify-between items-center py-4 px-6 bg-bg-dark h-[100vh]">
			<header>
				<TabSwitcher />
			</header>
			{tabContext.tab === "chat" ? <Chat /> : <MemoryManager />}
			{tabContext.tab === "chat" ? <Copybox /> : <></>}
		</div>
	)
}

export default App
