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
				m(`i${attrs.icon}`, { 'aria-hidden': 'true' }),
				m('span', ` ${attrs.name}`)
			]),
			BoxHeader.closeButton()
		])
}

export {
	BoxHeader
}