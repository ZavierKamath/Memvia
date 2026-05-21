import { useTab } from '../hooks/useTab.tsx'
import './TabSwitcher.css'

function TabSwitcher() {
	const tabContext = useTab();

	return (
		<div className='tab-switcher-container'>
			<button
				className={tabContext.tab === 'chat' ? 'active' : ''}
				onClick={tabContext.switchTab}
			>Chat</button>
			<button
				className={tabContext.tab === 'memories' ? 'active' : ''}
				onClick={tabContext.switchTab}
			>Memories</button>
		</div>
	)
}

export default TabSwitcher
