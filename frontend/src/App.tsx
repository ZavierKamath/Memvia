import './App.css';
import { useTab } from './hooks/useTab.tsx'
import Chat from './components/Chat.tsx';
import { MemoryManager } from './components/MemoryManager.tsx';

function App() {
	const tabContext = useTab();
	return (
		<>
			<h2>Tab: {tabContext.tab}</h2>
			<button onClick={tabContext.switchTab}>Switch Tab</button>
			{tabContext.tab === "chat" ? <Chat /> : <MemoryManager />}
		</>
	)
}

export default App
