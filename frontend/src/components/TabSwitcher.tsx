import { useTab } from '../hooks/useTab.tsx'

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
			>Memory Manager</button>
		</div>
	)
}

export default TabSwitcher
