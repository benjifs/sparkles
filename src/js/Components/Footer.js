import m from 'mithril'

import Store from '../Models/Store'

const Footer = () => {
	const session = Store.getSession()
	let theme = Store.getSettings('theme') || 'light'
	document.documentElement.setAttribute('data-theme', theme)

	let ui = Store.getSettings('ui')
	if (ui) {
		document.documentElement.setAttribute('data-ui', ui)
	}

	const toggleTheme = () => {
		theme = theme === 'light' ? 'dark' : 'light'
		Store.addToSettings({ theme })
		document.documentElement.setAttribute('data-theme', theme)
	}

	return {
		view: () =>
			m('footer', [
				null !== session && m(m.route.Link, {
					class: 'icon',
					href: '/settings',
					disabled: ['/settings'].includes(m.route.get())
				}, [
					m('i.fas.fa-gear', { title: 'settings' })
				]),
				m('a.icon', { onclick: toggleTheme }, theme === 'light' ?
					m('i.fas.fa-moon', { title: 'dark mode' })
					:
					m('i.fas.fa-sun', { title: 'light mode' })
				),
				m(m.route.Link, {
					class: 'icon',
					href: '/about',
					disabled: ['/about'].includes(m.route.get())
				}, [
					m('i.far.fa-circle-question', { title: 'about' })
				])
			])
	}
}

export default Footer