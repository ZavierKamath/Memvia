import { useTab } from '../hooks/useTab.tsx'
import './TabSwitcher.css'

function TabSwitcher() {
	const tabContext = useTab();

	return (
		<div className='tab-switcher-container'>
			<button
				disabled={tabContext.tab === 'chat' ? true : false}
				onClick={tabContext.switchTab}
			>Chat</button>
			<button
				disabled={tabContext.tab === 'memories' ? true : false}
				onClick={tabContext.switchTab}
			>Memories</button>
		</div>
	)
}

export default TabSwitcher
