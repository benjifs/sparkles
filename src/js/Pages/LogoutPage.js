import m from 'mithril'

import Store from '../Models/Store'

const LogoutPage = {
	oninit: () => {
		Store.clear()
		m.route.set('/login')
	},
	view: () => m('p', 'logged out')
}

export default LogoutPage