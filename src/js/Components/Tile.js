import m from 'mithril'

const Tile = {
	view: ({ attrs }) =>
		m(m.route.Link, {
			href: attrs.href,
			selector: 'button.sp-block',
			disabled: attrs.disabled || false
		}, [
			m('div', [
				m(`i.${attrs.icon}`, { 'aria-hidden': 'true' }),
				m('.sp-block-title', attrs.name)
			])
		])
}

export default Tile
