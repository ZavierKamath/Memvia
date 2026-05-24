import { useTab } from '../hooks/useTab.tsx'

function TabSwitcher() {
	const tabContext = useTab();
	const baseClass = "border-1 px-4 py-2 w-32 rounded-xl bg-gradient-to-b from-bg-light via-bg to-bg hover:text-text hover:border-highlight"
	const activeClass = "border-secondary font-bold text-text border-b-2 bg-bg-light"

	return (
		<div className='flex flex-row gap-4 w-120 justify-center'>
			<button
				className={`${baseClass} ${tabContext.tab === 'chat' ? activeClass : 'text-text-muted border-border-muted'}`}
				onClick={tabContext.switchTab}
			>Chat</button>
			<button
				className={`${baseClass} ${tabContext.tab === 'memories' ? activeClass : 'text-text-muted border-border-muted'}`}
				onClick={tabContext.switchTab}
			>Memories</button>
		</div>
	)
}

export default TabSwitcher
