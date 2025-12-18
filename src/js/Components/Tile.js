import m from 'mithril'

import Icon from './Icon'

const Tile = {
	view: ({ attrs }) =>
		m(m.route.Link, {
			href: attrs.href,
			selector: 'button',
			disabled: attrs.disabled || false
		}, [
			m('div', [
				attrs.icon ? m(Icon, { name: attrs.icon }) : null,
				m('div', attrs.name)
			])
		])
}

export default Tile
