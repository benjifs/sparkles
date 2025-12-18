import m from 'mithril'

const Icon = {
	view: ({ attrs: { name, className, label, width = 20, height = 20 } }) =>
		m('svg', {
			class: className,
			width, height,
			'aria-label': label,
			'aria-hidden': label ? 'false': 'true' },
			m('use', { href: `/assets/phosphor/icons.svg#${name}` }))
}

export default Icon
