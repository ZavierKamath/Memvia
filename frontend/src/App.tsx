import './App.css';
import Chat from './components/Chat.tsx';
import { ChatProvider } from './context/ChatContext.tsx';

function App() {
  return (
    <>
		<ChatProvider>
			<Chat />
		</ChatProvider>
    </>
  )
}

export default App
