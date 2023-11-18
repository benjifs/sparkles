import m from 'mithril'

import { Box } from '../Components/Box'
import { fetchMicropubConfig } from '../Controllers/Helpers'
import Tiles from '../Editors/Tiles'
import Store from '../Models/Store'

const HomePage = () => {
	const me = Store.getMe()
	let postTypes = []

	return {
		oninit: async () => {
			await fetchMicropubConfig()
			postTypes = Store.getSession('post-types') || []
			m.redraw()
		},
		view: () => [
			m(Box, m(Tiles(postTypes))),
			m('section', [
				m('p', [
					'Logged in as ',
					m('a', { href: me }, me),
					' ',
					m(m.route.Link, { class: 'icon', href: '/logout' }, m('i.fas.fa-right-from-bracket', { title: 'logout' }))
				])
			])
		]
	}
}

export default HomePage
