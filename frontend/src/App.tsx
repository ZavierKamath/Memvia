import { Chat } from './components/chat/Chat.tsx';
import { Header } from "./components/Header.tsx"
import { Sidebar } from "./components/Sidebar.tsx"
import { Sendbar } from "./components/chat/Sendbar.tsx"

function App() {
	return (
		<div className="h-screen grid grid-rows-[auto_1fr] grid-cols-[30rem_1fr] bg-bg">
			<Header />
			<aside className="row-start-2 col-start-1 overflow-y-scroll min-h-0">
				<Sidebar />
			</aside>
			<main className="row-start-2 col-start-2 overflow-hidden min-h-0 flex flex-col bg-bg-light">
				<Chat />
				<Sendbar />
			</main>
		</div>
	)
}

export default App
