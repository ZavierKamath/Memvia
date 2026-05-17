import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChatProvider } from './context/ChatContext.tsx';
import { MemoryProvider } from './context/MemoryContext.tsx';
import { TabProvider } from './context/TabContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
		<TabProvider>
			<MemoryProvider>
				<ChatProvider>
					<App />
				</ChatProvider>
			</MemoryProvider>
		</TabProvider>
  </StrictMode>,
)
