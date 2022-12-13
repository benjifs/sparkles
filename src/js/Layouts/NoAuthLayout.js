import m from 'mithril'

import DefaultLayout from './DefaultLayout'
import Store from '../Models/Store'

const NoAuthLayout = v => ({
	onmatch: () => {
		if (Store.getSession('access_token')) {
			m.route.set('/home')
		} else {
			return v
		}
	},
	render: vnode => m(DefaultLayout, vnode)
})

export default NoAuthLayout