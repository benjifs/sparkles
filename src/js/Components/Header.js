import m from 'mithril'

const Header = {
	view: () =>
		m('header', { hidden: true }, [
			m('.h-x-app.h-app', [
				m('a.u-url', { href: '/' }, [
					m('img.u-logo.p-name', {
						src: '/assets/icons/favicon-144x144.png',
						alt: 'sparkles'
					})
				])
			])
		])
}

export default Header