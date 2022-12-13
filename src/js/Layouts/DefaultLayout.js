import m from 'mithril'

import Header from '../Components/Header'
import Footer from '../Components/Footer'

const DefaultLayout = {
	view: v => [
		m(Header),
		m('main', [ v.children ]),
		m(Footer)
	]
}

export default DefaultLayout