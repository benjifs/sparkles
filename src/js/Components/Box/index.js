import m from 'mithril'

const BoxHeader = {
	closeButton: () =>
		m('button', {
			onclick: () => history.length <= 2 ? m.route.set('/') : history.back()
		}, [
			m('i.fas.fa-xmark', { title: 'close' })
		]),
	view: ({ attrs }) =>
		m('.sp-box-header', [
			BoxHeader.closeButton(),
			m('span.sp-box-header-title', [
				attrs.icon && m(`i${attrs.icon}`, { 'aria-hidden': 'true' }),
				attrs.title && m('span', ` ${attrs.title}`)
			]),
			BoxHeader.closeButton()
		])
}

const Box = {
	view: ({attrs, children}) =>
		m(`section.sp-box${attrs.className ? attrs.className : ''}`, [
			(attrs.icon || attrs.title) && m(BoxHeader, {
				icon: attrs.icon,
				title: attrs.title
			}),
			m('.sp-box-content', children)
		])
}

export {
	Box
}